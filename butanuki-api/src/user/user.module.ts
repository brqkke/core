import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserFieldResolver } from './user.field.resolver';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver, UserFieldResolver],
  exports: [UserService],
})
export class UserModule {}
