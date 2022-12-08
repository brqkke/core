import { Injectable } from '@nestjs/common';
import { BityClientService } from '../bity/bity.client.service';
import { AxiosResponse } from 'axios';
import { paths } from '../bity/generated/schema';
import ClientOAuth2 from 'client-oauth2';

@Injectable()
export class MockBityService extends BityClientService {
  public data = {
    orders: new Map<
      string,
      paths['/orders/{order_uuid}']['get']['responses']['200']['content']['application/json']
    >(),
    ordersUsers: new Map<string, string>(),
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
    if (endpoint.startsWith('/orders/') && method === 'GET') {
      const id = endpoint.match(/\/orders\/([0-9A-z-]+)/)?.[1];
      if (id && this.data.orders.has(id)) {
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
    }
    if (endpoint === '/orders') {
      return Promise.resolve({
        status: 200,
        data: {
          orders: Array.from(this.data.orders.values()),
        } as R,
        statusText: 'OK',
        headers: {},
        config: {},
      });
    }

    return Promise.reject(new Error('Not implemented'));
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
        refreshToken: Math.random().toString(36).substring(10),
        accessToken: Math.random().toString(36).substring(10),
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
    const refreshToken = Math.random().toString(36).substring(10);
    const accessToken = Math.random().toString(36).substring(10);
    const tokensChain = Math.random().toString(36).substring(10);
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
