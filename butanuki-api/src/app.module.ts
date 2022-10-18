import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    MailerModule,
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front-build'),
      exclude: ['/api/graphql'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (db: DataSource) => ({
        driver: ApolloDriver,
        introspection: true,
        cache: 'bounded',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: true,
        path: '/api/graphql',
        context: (ctx) => {
          const dataloaders = buildDataloaders(db);
          return { ...ctx, dataloaders };
        },
      }),
      inject: [DataSource],
    }),
    OrderModule,
    BityModule,
    DatabaseModule,
    UserModule,
    VaultModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
