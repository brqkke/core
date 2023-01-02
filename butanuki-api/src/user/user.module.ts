import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserFieldResolver } from './user.field.resolver';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { MfaModule } from '../mfa/mfa.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver, UserFieldResolver],
  exports: [UserService],
  imports: [DatabaseModule, MfaModule],
})
export class UserModule {}
