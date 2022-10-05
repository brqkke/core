import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfigService } from '../config/app.config.service';
import { HttpService } from '@nestjs/axios';
import ClientOAuth2 from 'client-oauth2';
import { buildRepositories, genRandomString } from '../utils';
import { User } from '../entities/User';
import { OrderService } from '../order/order.service';
import { DataSource, QueryFailedError } from 'typeorm';
import { Token } from '../entities/Token';
import { TokenStatus } from '../entities/enums/TokenStatus';
import { BityClientService } from './bity.client.service';
import { MailerService } from '../emails/MailerService';
import { paths } from './generated/schema';

type GetOrderResponse =
  paths['/orders/{order_uuid}']['get']['responses']['200']['content']['application/json'];

@Injectable()
export class BityService {
  constructor(
    private config: AppConfigService,
    private http: HttpService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    private db: DataSource,
    private bityClient: BityClientService,
    private mailer: MailerService,
  ) {}

  getBityLoginUrl(): string {
    return this.bityClient.getBityOAuthClient().code.getUri({
      state: genRandomString(64),
    });
  }

  getTokenFromCodeRedirectUrl(
    redirectUrl: string,
  ): Promise<ClientOAuth2.Token | null> {
    return this.bityClient
      .getBityOAuthClient()
      .code.getToken(redirectUrl)
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  //1 fetch the updated token
  //2 if it was already updated, just return it
  //3 Call the bity oauth api to refresh the token
  //4 on success return the updated token
  //5 on error incrmeent the retry counter and set the status to NEED_REFRESH_RETRY
  //6 if the retry counter reach the limit, set the status to broken and send an email
  async refreshBityToken(token: Token): Promise<Token | null> {
    const result: { retry: true } | { retry: false; token: Token | null } =
      await this.db.manager.transaction(
        'SERIALIZABLE',
        async (entityManager) => {
          const db = buildRepositories(entityManager);
          // await new Promise((r) => setTimeout(r, Math.random() * 3000));

          let dbToken: Token;

          try {
            dbToken = await db.token.findOneOrFail({
              lock: {
                mode: 'pessimistic_write',
                tables: ['token'],
              },
              where: { id: token.id },
              relations: ['user'],
            });
          } catch (e: unknown) {
            console.log(e);
            if (typeof e === 'object' && e instanceof QueryFailedError) {
              if (e.driverError.code === '40001') {
                return { retry: true };
              }
            }
            throw e;
          }
          if (dbToken.accessToken !== token.accessToken) {
            return { retry: false, token: dbToken };
          }

          const newToken = await this.bityClient.refreshToken(
            token.refreshToken,
          );
          dbToken.lastRefreshTriedAt = new Date();
          dbToken.refreshTriesCount++;

          if (newToken) {
            dbToken.lastRefreshedAt = new Date();
            dbToken.accessToken = newToken.accessToken;
            dbToken.refreshToken = newToken.refreshToken;
            dbToken.status = TokenStatus.ACTIVE;
            dbToken.refreshTriesCount = 0;
            return { retry: false, token: await db.token.save(dbToken) };
          }

          if (
            dbToken.refreshTriesCount > this.config.config.bity.refreshMaxRetry
          ) {
            dbToken.status = TokenStatus.BROKEN;
            await this.mailer.sendBityRelink(dbToken.user.email);
          } else {
            dbToken.status = TokenStatus.NEED_REFRESH_RETRY;
          }
          await db.token.save(dbToken, { reload: false });

          return { retry: false, token: null };
        },
      );

    return result.retry ? this.refreshBityToken(token) : result.token;
  }

  protected async doBityRequestWithRetryRefresh<R = any>({
    token,
    endpoint,
    method = 'GET',
    body,
  }: {
    token: Token;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: object;
  }) {
    let tokenResult = token;
    const response = await this.bityClient.doBityRequest<R>(
      {
        endpoint,
        accessToken: token.accessToken,
        method,
        body,
      },
      async () => {
        const newToken = await this.refreshBityToken(token);
        if (newToken) {
          tokenResult = newToken;
          return newToken.accessToken;
        }
        throw new UnauthorizedException({
          success: false,
          error: "Can't refresh token",
        });
      },
    );
    return { newToken: tokenResult, response };
  }

  async useTokenOnUser(token: ClientOAuth2.Token, user: User): Promise<Token> {
    //does token belong to user
    if (!(await this.canUserUseToken(token, user))) {
      throw new UnauthorizedException({
        error: 'account has order linked to another bity account',
      });
    }

    return this.db.manager.transaction(
      'SERIALIZABLE',
      async (entityManager) => {
        const db = buildRepositories(entityManager);
        await db.token.delete({ userId: user.id });
        const newToken = db.token.create({
          user,
          status: TokenStatus.ACTIVE,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          userId: user.id,
        });
        await db.token.save(newToken);
        return newToken;
      },
    );
  }

  async canUserUseToken(
    token: ClientOAuth2.Token,
    user: User,
  ): Promise<boolean> {
    const lastOrder = await this.orderService.getMostRecentOrder(user.id);
    if (!lastOrder) {
      return true;
    }

    const response = await this.bityClient.getOrder({
      token: token.accessToken,
      id: lastOrder.remoteId,
    });

    if (response.status !== 200) {
      return false;
    }

    return !!response.data.output;
  }

  async removeToken(user: User) {
    return this.db.getRepository(Token).delete({ userId: user.id });
  }

  async placeBityOrder({
    amount,
    cryptoAddress,
    token,
    currency,
  }: {
    currency: 'EUR' | 'CHF';
    amount: number;
    cryptoAddress: string;
    token: Token;
  }) {
    const body = {
      input: { amount: '' + amount, currency },
      output: {
        currency: 'BTC',
        crypto_address: cryptoAddress,
        type: 'crypto_address',
      },
      partner_fee: { factor: this.config.config.bity.partnerFee },
    };
    const { response, newToken } = await this.doBityRequestWithRetryRefresh({
      token,
      endpoint: '/orders',
      method: 'POST',
      body,
    });
    const orderLocation = response.headers['location'];
    if (response.status !== 201 || !orderLocation) {
      if (response.data.errors?.length) {
        console.info(response.data.errors);
        throw new InternalServerErrorException(response.data.errors);
      }
      return null;
    }
    const orderId = orderLocation
      .split('/')
      .filter((part) => !!part.length)
      .pop();

    if (orderId) {
      const { response: order } = await this.getBityOrder({
        orderId,
        token: newToken,
      });
      if (order.status === 200) {
        return order.data;
      }
    }

    return null;
  }

  public getBityOrder({ orderId, token }: { token: Token; orderId: string }) {
    return this.doBityRequestWithRetryRefresh<GetOrderResponse>({
      token,
      endpoint: `/orders/${orderId}`,
    });
  }

  // async doRawBityRequest<R = any>({
  //   accessToken,
  //   endpoint,
  //   method = 'GET',
  //   body,
  // }: {
  //   accessToken: string;
  //   endpoint: string;
  //   method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  //   body?: object;
  // }): Promise<AxiosResponse<R>> {
  //   const url = `${this.config.config.bity.oauthConfig.baseUrl}${endpoint}`;
  //   return firstValueFrom(
  //     this.http.request({
  //       url,
  //       method,
  //       data: body,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         ...(body ? { 'Content-Type': 'application/json' } : {}),
  //       },
  //     }),
  //   );
  // }
}
