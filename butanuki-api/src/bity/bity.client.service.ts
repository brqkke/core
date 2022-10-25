import { AppConfigService } from '../config/app.config.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { paths } from './generated/schema';
import { Injectable } from '@nestjs/common';
import ClientOAuth2 from 'client-oauth2';

@Injectable()
export class BityClientService {
  constructor(private config: AppConfigService, private http: HttpService) {}

  public async refreshToken(
    refreshToken: string,
  ): Promise<ClientOAuth2.Token | null> {
    console.log('Refreshing', refreshToken);
    const body = new URLSearchParams({
      client_id: this.config.config.bity.oauthConfig.clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    const r = await firstValueFrom(
      this.http.post<ClientOAuth2.Data | { error: any }>(
        this.config.config.bity.oauthConfig.accessTokenUri,
        body,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          validateStatus: () => true,
        },
      ),
    );
    console.log('refreshed token', body, r.data, r.status);
    if (r.status >= 400) {
      return null;
    }

    return this.getBityOAuthClient().createToken(r.data);
  }

  getOrder(params: { token: string; id: string }) {
    return this.doRawBityRequest<
      paths['/orders/{order_uuid}']['get']['responses']['200']['content']['application/json']
    >({ accessToken: params.token, endpoint: '/orders/' + params.id });
  }

  getBityOAuthClient() {
    return new ClientOAuth2(this.config.config.bity.oauthConfig);
  }

  public async doBityRequest<R = any>(
    {
      accessToken,
      endpoint,
      method = 'GET',
      body,
    }: {
      accessToken: string;
      endpoint: string;
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: object;
    },
    refreshToken?: () => Promise<string>,
  ): Promise<AxiosResponse<R>> {
    const response = await this.doRawBityRequest<R>({
      endpoint,
      method,
      body,
      accessToken,
    });

    if (response.status === 401 && refreshToken) {
      const newToken = await refreshToken();
      return this.doBityRequest({
        endpoint,
        method,
        accessToken: newToken,
        body,
      });
    }

    return response;
  }

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
    const url = `${this.config.config.bity.oauthConfig.baseUrl}${endpoint}`;
    return firstValueFrom(
      this.http.request({
        url,
        method,
        data: body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        validateStatus: (_) => true,
      }),
    );
  }
}
