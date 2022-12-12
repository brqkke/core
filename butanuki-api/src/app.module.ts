import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { BityModule } from './bity/bity.module';
import { AppConfigModule } from './config/config.module';
import { MailerModule } from './emails/mailer.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './controllers/app.controller';
import { UserModule } from './user/user.module';
import { VaultModule } from './vault/vault.module';
import { DataSource } from 'typeorm';
import { buildDataloaders } from './dataloader/dataloaders';
import { AppConfigService } from './config/app.config.service';
import { ErrorModule } from './error/error.module';
import { CommandModule } from './command/command.module';
import { ServerResponse } from 'http';
import { RateModule } from './rate/rate.module';
import { I18nModule } from './i18n/i18n.module';
import { DcaEstimatorModule } from './dca-estimator/dca-estimator.module';
import { IndexHtmlMiddleware } from './middlewares/IndexHtmlMiddleware';

export const STATIC_PATH = join(__dirname, '..', 'front-build/');

@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    MailerModule,
    AuthModule,
    UserModule,
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        return [
          {
            rootPath: STATIC_PATH,
            exclude: ['/api/graphql', '/savings'],
            serveStaticOptions: {
              setHeaders: (res, path, stat) => {
                if (
                  path.replace(STATIC_PATH, '') === 'index.html' &&
                  res instanceof ServerResponse
                ) {
                  res.setHeader(
                    'Link',
                    '</api/config>; rel="preload"; as="fetch"',
                  );
                }
              },
            },
          },
        ];
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (db: DataSource, { config }: AppConfigService) => ({
        driver: ApolloDriver,
        introspection: config.nodeEnv === 'development',
        cache: 'bounded',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: config.nodeEnv === 'development',
        path: '/api/graphql',
        context: (ctx) => {
          const dataloaders = buildDataloaders(db);
          return { ...ctx, dataloaders };
        },
      }),
      inject: [DataSource, AppConfigService],
      imports: [AppConfigModule],
    }),
    OrderModule,
    BityModule,
    DatabaseModule,
    UserModule,
    VaultModule,
    ErrorModule,
    CommandModule,
    RateModule,
    I18nModule.forRootAsync(),
    DcaEstimatorModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IndexHtmlMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
