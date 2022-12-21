import { Injectable } from '@nestjs/common';
import { BityClientService } from '../bity/bity.client.service';
import { AxiosResponse } from 'axios';
import { paths } from '../bity/generated/schema';
import ClientOAuth2 from 'client-oauth2';
import { cloneDeep } from 'lodash';

@Injectable()
export class MockBityService extends BityClientService {
  public data = {
    orders: new Map<
      string,
      paths['/orders/{order_uuid}']['get']['responses']['200']['content']['application/json']
    >(),
    ordersUsers: new Map<string, string>(),
    alreadyDuplicated: new Set<string>(),
  };

  protected async doRawBityRequest<R = any>({
    accessToken,
    endpoint,
    method = 'GET',
    body,
  }: {
    accessToken: string;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: object;
  }): Promise<AxiosResponse<R>> {
    const url = new URL(endpoint, this.config.config.bity.oauthConfig.baseUrl);
    const token = this.tokens.get(accessToken);
    if (!token || token.accessExpired) {
      return Promise.resolve({
        data: null as R,
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {},
      });
    }
    switch (method) {
      case 'GET':
        if (endpoint.startsWith('/orders/') && method === 'GET') {
          const id = endpoint.match(/\/orders\/([0-9A-z-]+)/)?.[1];
          if (
            id &&
            this.data.orders.has(id) &&
            this.data.ordersUsers.get(id) === token.userId
          ) {
            return Promise.resolve({
              data: this.data.orders.get(id)! as R,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {},
            });
          }
          return Promise.resolve({
            data: null as R,
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            config: {},
          });
        } else if (url.pathname === '/orders') {
          return Promise.resolve({
            status: 200,
            data: {
              orders: Array.from(this.data.orders.values()).filter(
                (order) =>
                  this.data.ordersUsers.get(order.id!) === token.userId,
              ),
            } as R,
            statusText: 'OK',
            headers: {},
            config: {},
          });
        }
        break;
      case 'POST':
        if (endpoint === '/orders') {
          const order =
            body as paths['/orders']['post']['requestBody']['content']['application/json'];
          const id = Math.random().toString(36).substring(2);
          //generate random string
          //to uppercase
          //split in two parts
          //join with a dash
          //prepend bity.com
          const reference = Math.random()
            .toString(36)
            .substring(2)
            .toUpperCase()
            .match(/.{1,4}/g)!
            .join('-');
          this.data.orders.set(id, {
            input: order.input,
            output: order.output,
            timestamp_cancelled: undefined,
            timestamp_created: new Date().toISOString(),
            timestamp_payment_received: undefined,
            timestamp_price_guaranteed: undefined,
            timestamp_executed: undefined,
            id: id,
            payment_details: {
              account_number: '123456789',
              bank_code: '123456789',
              type: 'bank_account',
              reference: `bity.com ${reference}`,
              bank_address: '1234 Main Street, Anytown, USA',
              iban: 'DE12345678901234567890',
              swift_bic: 'DEUTDEFF',
              recipient_name: 'John Doe',
              recipient: 'John Doe',
            },
          });
          this.data.ordersUsers.set(id, token.userId);
          return Promise.resolve({
            status: 201,
            data: null as R,
            statusText: 'Created',
            headers: {
              location: `/orders/${id}`,
            },
            config: {},
          });
        } else if (endpoint.match(/\/orders\/([0-9A-z-]+)\/duplicate/)) {
          const id = endpoint.match(/\/orders\/([0-9A-z-]+)\/duplicate/)![1];
          if (this.data.alreadyDuplicated.has(id)) {
            return Promise.resolve({
              status: 400,
              data: { errors: [{ code: 'order_already_duplicated' }] } as R,
              statusText: 'Bad Request',
              headers: {},
              config: {},
            });
          }
          if (this.data.ordersUsers.get(id) !== token.userId) {
            return Promise.resolve({
              status: 403,
              data: null as R,
              statusText: 'Forbidden',
              headers: {},
              config: {},
            });
          }
          this.data.alreadyDuplicated.add(id);
          const order = this.data.orders.get(id)!;
          const newId = Math.random().toString(36).substring(2);
          const cloned = cloneDeep(order);
          cloned.id = newId;
          cloned.timestamp_created = new Date().toISOString();
          cloned.timestamp_executed = undefined;
          cloned.timestamp_payment_received = undefined;
          cloned.timestamp_price_guaranteed = undefined;
          cloned.timestamp_cancelled = undefined;
          cloned.output!.amount = undefined;
          this.data.orders.set(newId, cloned);
          this.data.ordersUsers.set(newId, token.userId);
          return Promise.resolve({
            status: 201,
            data: null as R,
            statusText: 'Created',
            headers: {
              location: `/orders/${newId}`,
            },
            config: {},
          });
        }
        break;
    }

    return Promise.reject(
      new Error('Not implemented, ' + method + ' ' + endpoint),
    );
  }

  public tokens = new Map<
    string,
    {
      refreshToken: string;
      accessToken: string;
      accessExpired: boolean;
      refreshExpired: boolean;
      tokensChain: string;
      userId: string;
    }
  >();
  private tokenChains = new Map<string, string[]>();

  /**
   * Create a fake token from a refresh token
   * If the refresh token is not found, return null
   * If the refresh token is obsolete, return null and make all the other tokens for this chain obsolete
   * @param refreshToken
   */
  async refreshToken(refreshToken: string): Promise<ClientOAuth2.Token | null> {
    if (this.tokens.has(refreshToken)) {
      const token = this.tokens.get(refreshToken)!;
      if (token.refreshExpired) {
        const tokensToMakeObsolete =
          this.tokenChains.get(token.tokensChain) || [];

        tokensToMakeObsolete.forEach((t) => {
          this.tokens.get(t)!.refreshExpired = true;
        });
        return null;
      }
      token.refreshExpired = true;
      const newToken = {
        refreshToken: Math.random().toString(36).substring(2),
        accessToken: Math.random().toString(36).substring(2),
        accessExpired: false,
        refreshExpired: false,
        tokensChain: token.tokensChain,
        userId: token.userId,
      };
      this.tokens.set(newToken.refreshToken, newToken);
      this.tokens.set(newToken.accessToken, newToken);
      this.tokenChains.get(token.tokensChain)!.push(newToken.refreshToken);

      return Promise.resolve(
        this.getBityOAuthClient().createToken({
          access_token: newToken.accessToken,
          refresh_token: newToken.refreshToken,
          expires_in: '3600',
        }),
      );
    }
    return null;
  }

  async makeTokenFromRedirectUrl(
    redirectUrl: string,
  ): Promise<ClientOAuth2.Token | null> {
    if (redirectUrl === 'invalid') {
      return null;
    }

    const data = JSON.parse(redirectUrl) as { userId: string };
    const refreshToken = Math.random().toString(36).substring(2);
    const accessToken = Math.random().toString(36).substring(2);
    const tokensChain = Math.random().toString(36).substring(2);
    const token = {
      refreshToken,
      accessToken,
      accessExpired: false,
      refreshExpired: false,
      tokensChain,
      userId: data.userId,
    };
    this.tokens.set(refreshToken, token);
    this.tokens.set(accessToken, token);
    this.tokenChains.set(tokensChain, [refreshToken]);
    return Promise.resolve(
      this.getBityOAuthClient().createToken({
        refresh_token: refreshToken,
        access_token: accessToken,
        expires_in: '3600',
      }),
    );
  }
}
