import { AppConfigService } from '../config/app.config.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import ClientOAuth2 from 'client-oauth2';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BityReportingService {
  constructor(private config: AppConfigService, private http: HttpService) {}

  async getBityReportingAccessToken() {
    const client = new ClientOAuth2(this.config.config.bity.reportingConfig);
    return (await client.credentials.getToken()).accessToken;
  }

  async doReportingRequest({
    accessToken,
    endpoint,
    method = 'GET',
  }: {
    accessToken: string;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  }) {
    return await firstValueFrom(
      this.http.request({
        url: `${this.config.config.bity.reportingConfig.baseUrl}${endpoint}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        validateStatus: () => true,
        method,
      }),
    );
  }

  async getMonthReporting(date: Date) {
    const month = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
    const token = await this.getBityReportingAccessToken();
    return (
      await this.doReportingRequest({
        accessToken: token,
        endpoint: `/summary/monthly/${month}`,
      })
    ).data;
  }
}
