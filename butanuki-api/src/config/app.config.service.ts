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
      nodeEnv: config.getOrThrow<string>('NODE_ENV'),
      db: {
        useMockDb: config.get('DB_USE_MOCK', 'false') === 'true',
        host: config.getOrThrow<string>('DB_HOST'),
        port: parseInt(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
      },
      publicWebsiteBaseUrl: config.getOrThrow<string>(
        'PUBLIC_WEBSITE_BASE_URL',
      ),
      recaptcha: {
        key: config.getOrThrow<string>('RECAPTCHA_KEY'),
        secret: config.getOrThrow<string>('RECAPTCHA_SECRET'),
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
        refreshMaxRetry: 4,
        refreshRetryDelay: parseInt(
          config.get('BITY_REFRESH_DELAY', '' + 3 * 3600),
        ),
        partnerFee: 0.007, //Fees percentage between 0 and 1 (3% = 0.03, 10% = 0.1, etc)
      },
      singleLoginTokenTTL: 60 * 10, // 10 minutes
      sessionTokenTTL: 60 * 60, // 1h
      backgroundAgent: {
        disable: config.get<string>('DISABLE_SCHEDULER', 'false') === 'true',
        apiKey: config.getOrThrow<string>('BACKGROUND_AGENT_API_KEY'),
        baseUrl: config.getOrThrow<string>('BASE_URL') + '/api',
        orderCheckBatchSize: 10, //Check open orders by group of n
        orderCheckInterval: parseInt(
          config.getOrThrow<string>('ORDER_CHECK_INTERVAL', '3600'),
        ), //Check open orders every hours,
        reporting: {
          reportingInterval: 3600 * 24, //1 day
          reportingEmail: config.get<string>(
            'REPORTING_EMAIL',
            'taccolaaless@gmail.com',
          ), //'reportingbity@uazo.com',
          alertEmail: config.get(
            'REPORTING_ALERT_EMAIL',
            'taccolaaless@gmail.com',
          ),
        },
        bitcoinPriceRefreshInterval: 15 * 60, //15 minutes
      },
      vault: {
        maxVaultsPerUser: 3,
        maxOrdersTemplatesPerVault: 3,
      },
      exchangeRateData: {
        apiKey: config.get<string>('HISTORICAL_RATE_API_KEY', 'xxx'),
      },
    };
  }
}
