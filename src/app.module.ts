import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user.module';
import { OrderModule } from './order/order.module';
import { BityModule } from './bity/bity.module';
import { AppConfigModule } from './config/config.module';
import { MailerModule } from './emails/mailer.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    HttpModule,
    AppConfigModule,
    MailerModule,
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'front-build'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    OrderModule,
    BityModule,
    DatabaseModule,
  ],
})
export class AppModule {}
