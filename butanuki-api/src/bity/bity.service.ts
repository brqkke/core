import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/app.config.service';
import { HttpService } from '@nestjs/axios';
import ClientOAuth2 from 'client-oauth2';
import {
  acquireLockOnEntity,
  buildRepositories,
  genRandomString,
  Repositories,
} from '../utils';
import { User } from '../entities/User';
import { OrderService } from '../order/order.service';
import { DataSource } from 'typeorm';
import { Token } from '../entities/Token';
import { TokenStatus } from '../entities/enums/TokenStatus';
import { BityClientService } from './bity.client.service';
import { MailerService } from '../emails/MailerService';
import { paths } from './generated/schema';
import { Order } from '../entities/Order';
import { EventLogType } from '../entities/EventLog';
import { TokenHistoryCause } from '../entities/enums/TokenHistoryCause';
import { TokenHistory } from '../entities/TokenHistory';
import { ErrorType, makeError } from '../error/ErrorTypes';

export type GetOrderResponse =
  paths['/orders/{order_uuid}']['get']['responses']['200']['content']['application/json'];

export type GetOrdersResponse =
  paths['/orders']['get']['responses']['200']['content']['application/json'];

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
    return this.bityClient.getBityOAuthClient().code.getToken(redirectUrl);
  }

  /**
   *<pre> first we acquire an advisory lock with the token id as a key to prevent concurrent updates
   * Then fetch the token from the db to get a fresh one
   * If the token changed
   *    it means we have an obsolete version
   *    this means we don't have to refresh it, we just return the recent version
   * If it hasn't changed
   *    we increment the version number
   *    it means we can now try to refresh it
   *    if it succeeds
   *       we update it in the database and we return the updated token
   *       we also save a copy of that new token in the token_history table
   *    if it doesn't succeed
   *        we increment the number of refresh tries and we set it's status to NEED_REFRESH_RETRY
   *        this token is now in a "suspended state" and a job will take care of refreshing it later in case it was a temporary issue
   *        if token retries count is 1
   *            We send an email to the alert reporting address to notify us of this fail.
   *        if the number of tries reaches a treshold (3)
   *            we set the token status to BROKEN and it is considered as not working anymore
   *            we send an email to the person</pre>
   */
  async refreshBityToken(token: Token): Promise<Token | null> {
    return this.db.manager.transaction(async (entityManager) => {
      const db = buildRepositories(entityManager);
      const lock = await acquireLockOnEntity(Token, token.id, entityManager);
      console.log('acquire lock', lock);
      const dbToken: Token = await db.token.findOneOrFail({
        where: { id: token.id },
        relations: ['user'],
      });

      if (dbToken.version !== token.version) {
        return dbToken;
      } else {
        dbToken.version++;
      }

      if (dbToken.status === TokenStatus.BROKEN) {
        return null;
      }

      const newToken = await this.bityClient.refreshToken(token.refreshToken);
      const newTokenHistoryCause: TokenHistoryCause = TokenHistoryCause.REFRESH;
      console.log(token.id, newToken);
      dbToken.lastRefreshTriedAt = new Date();
      dbToken.refreshTriesCount++;

      if (newToken) {
        dbToken.lastRefreshedAt = new Date();
        dbToken.accessToken = newToken.accessToken;
        dbToken.refreshToken = newToken.refreshToken;
        dbToken.status = TokenStatus.ACTIVE;
        dbToken.refreshTriesCount = 0;

        //Note: this operation doesn't use the transaction's entityManager
        //If the transaction is reverted, the record will still be there
        await this.saveTokenToHistory(dbToken, newTokenHistoryCause).catch(
          (err) => console.log('An error occured in saveTokenToHistory', err),
        );

        return db.token.save(dbToken);
      }

      if (dbToken.refreshTriesCount === 1) {
        await this.mailer.sendReportBityRefreshError(dbToken).catch((err) => {
          console.log('an error occured while sendReportBityRefreshError', err);
        });
      }

      if (dbToken.refreshTriesCount > this.config.config.bity.refreshMaxRetry) {
        dbToken.status = TokenStatus.BROKEN;
        await this.mailer.sendBityRelink(dbToken.user.email);
        await db.eventLog.insert({
          data: dbToken.user.id,
          createdAt: new Date(),
          type: EventLogType.BROKEN_TOKEN,
        });
      } else {
        dbToken.status = TokenStatus.NEED_REFRESH_RETRY;
      }
      await db.token.save(dbToken, { reload: false });
      return null;
    });
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
        throw makeError(ErrorType.CantRefreshBityToken);
      },
    );
    return { newToken: tokenResult, response };
  }

  async saveTokenToHistory(
    newToken: Token,
    cause: TokenHistoryCause,
    db?: Repositories,
  ) {
    const repositories = db || buildRepositories(this.db.manager);
    const history = new TokenHistory();
    history.creationCause = cause;
    history.tokenId = newToken.id;
    history.userId = newToken.userId;
    history.accessToken = newToken.accessToken;
    history.refreshToken = newToken.refreshToken;

    return repositories.tokenHistory.save(history);
  }

  async useTokenOnUser(token: ClientOAuth2.Token, user: User): Promise<Token> {
    //does token belong to user
    if (!(await this.canUserUseToken(token, user))) {
      throw makeError(
        ErrorType.ButanukiAccountPreviouslyLinkedToOtherBityAccount,
      );
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
          version: 0,
        });
        await db.token.save(newToken);
        await this.saveTokenToHistory(
          newToken,
          TokenHistoryCause.MANUAL_CHANGE,
        );
        user.token = newToken;
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
        if (
          response.data.errors.some(
            (e: any) => e.code === 'input_payment_information_required',
          )
        ) {
          throw makeError(ErrorType.NeedVerifiedBityAccount);
        } else {
          throw makeError(ErrorType.UnknownBityError);
        }
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

  async cancelBityOrder({ id, token }: { id: string; token: Token }) {
    return this.doBityRequestWithRetryRefresh({
      token,
      method: 'POST',
      endpoint: `/orders/${id}/cancel`,
    });
  }

  public async renewOrder({ order, token }: { order: Order; token: Token }) {
    let latestToken: Token = token;
    const { response, newToken } = await this.doBityRequestWithRetryRefresh({
      endpoint: `/orders/${order.remoteId}/duplicate`,
      method: 'POST',
      token: latestToken,
    });
    latestToken = newToken;

    console.log(
      { remoteId: order.remoteId, token, latestToken },
      response.status,
      response.data,
    );

    let orderId: string | null = null;
    if (response.status === 201) {
      const orderLocation = response.headers['location'];
      orderId =
        orderLocation
          ?.split('/')
          .filter((part) => !!part.length)
          .pop() || '';
    }
    if (response.status === 400) {
      console.log('Caught 400 while renewing order ', order.remoteId);
      if (
        response.data.errors &&
        response.data.errors.some(
          (err: any) => err.code === 'order_already_duplicated',
        )
      ) {
        const fetchedNewOrder = await this.findBityOrderRenewingOrder(
          order,
          latestToken,
        );
        latestToken = fetchedNewOrder.newToken;
        if (fetchedNewOrder.orderId) {
          console.log('New Order was fetched from bity', fetchedNewOrder);
          orderId = fetchedNewOrder.orderId;
        } else {
          console.log('Error, new Order could not be fetched from bity');
        }
      }
    }

    if (orderId) {
      return this.getBityOrder({ token: latestToken, orderId });
    }
    return null;
  }

  //In case we already duplicated an order, we try to find the new order on bity's side
  //We fetch the current order and find a bity order with the same reference created after the current one
  async findBityOrderRenewingOrder(
    order: Order,
    token: Token,
  ): Promise<{ newToken: Token; orderId: string | null }> {
    const reference = order.transferLabel;

    const { newToken, response } = await this.getBityOrder({
      orderId: order.remoteId,
      token,
    });
    let latestToken = newToken;

    if (response.status !== 200 || !response.data.timestamp_created) {
      return { newToken: latestToken, orderId: null };
    }

    const lastKnownOrderTimestamp = response.data.timestamp_created;
    for (let page = 1; ; page++) {
      const { response, newToken } =
        await this.doBityRequestWithRetryRefresh<GetOrdersResponse>({
          token: latestToken,
          endpoint: `/orders?page=${page}`,
        });
      latestToken = newToken;
      if (response.status !== 200) {
        break;
      }
      const newOrder = response.data.orders.find((bityOrder) => {
        return (
          bityOrder.id !== order.remoteId &&
          bityOrder.payment_details?.reference === reference &&
          bityOrder.timestamp_created > lastKnownOrderTimestamp
        );
      });
      if (newOrder) {
        return { newToken: latestToken, orderId: newOrder.id };
      }
      if ((response.data.pagination?.last || 1) <= page) {
        break;
      }
    }

    return { newToken: latestToken, orderId: null };
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
