import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private cachedConfig: ReturnType<typeof AppConfigService.generateAppConfig>;

  get config() {
    if (!this.cachedConfig) {
      this.cachedConfig = AppConfigService.generateAppConfig(
        this.configService,
      );
    }
    return this.cachedConfig;
  }

  static generateAppConfig(config: ConfigService) {
    return {
      port: config.getOrThrow<number>('PORT', 3000),
      baseUrl: config.getOrThrow<string>('BASE_URL'),
      publicWebsiteBaseUrl: config.getOrThrow<string>(
        'PUBLIC_WEBSITE_BASE_URL',
      ),
      recaptcha: {
        key: config.getOrThrow<string>('RECAPTCHA_KEY'),
        secret: config.getOrThrow<string>('RECAPTCHA_SECRET'),
      },
      sendinblue: {
        key: config.getOrThrow<string>('SENDINBLUE_KEY'),
      },
      email: {
        from: config.getOrThrow<string>('EMAIL_FROM'),
        smtp: {
          host: config.getOrThrow<string>('SMTP_HOST'),
          port: config.getOrThrow<number>('SMTP_PORT'),
          username: config.getOrThrow<string>('SMTP_USER'),
          password: config.getOrThrow<string>('SMTP_PASSWORD'),
        },
      },
      ssl: {
        enable: config.getOrThrow<boolean>('USE_SSL', false),
        keyPath: config.get<string>('SSL_KEY_PATH'),
        certPath: config.get<string>('SSL_CERT_PATH'),
      },
      bity: {
        oauthConfig: {
          clientId: config.getOrThrow<string>('BITY_CLIENT_ID'),
          accessTokenUri: 'https://connect.bity.com/oauth2/token',
          authorizationUri: 'https://connect.bity.com/oauth2/auth',
          redirectUri:
            config.getOrThrow<string>('REDIRECT_BASE_OAUTH_URL') +
            '/auth/bity/callback',
          scopes: [
            'https://auth.bity.com/scopes/exchange.place',
            'https://auth.bity.com/scopes/exchange.history',
            'offline_access',
          ],
          baseUrl: 'https://exchange.api.bity.com/v2',
        },
        reportingConfig: {
          clientId: config.getOrThrow<string>('BITY_REPORTING_CLIENT_ID'),
          clientSecret: config.getOrThrow<string>(
            'BITY_REPORTING_CLIENT_SECRET',
          ),
          authorizationUri: 'https://connect.bity.com/oauth2/auth',
          accessTokenUri: 'https://connect.bity.com/oauth2/token',
          scopes: ['https://auth.bity.com/scopes/reporting.exchange'],
          baseUrl: 'https://reporting.api.bity.com/exchange/v1',
        },
        partnerFee: 0.007, //Fees percentage between 0 and 1 (3% = 0.03, 10% = 0.1, etc)
      },
      singleLoginTokenTTL: 60 * 10, // 10 minutes
      sessionTokenTTL: 60 * 60 * 24 * 10, // 10 j
      backgroundAgent: {
        apiKey: config.getOrThrow<string>('BACKGROUND_AGENT_API_KEY'),
        baseUrl: config.getOrThrow<string>('BASE_URL') + '/api',
        orderCheckBatchSize: 50, //Check open orders by group of n
        orderCheckInterval: 300, //Check open orders every hours,
        reporting: {
          reportingInterval: 3600 * 24, //1 day
          reportingEmail: 'reportingbity@uazo.com',
        },
      },
    };
  }
}
