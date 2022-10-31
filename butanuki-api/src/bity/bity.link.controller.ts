import { Controller, Post } from '@nestjs/common';
import { BityService } from './bity.service';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { User } from '../entities/User';
import { UserRole } from '../entities/enums/UserRole';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BityLinkCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Field()
  redirectedFrom: string;
}

@Controller('bity/link')
@Roles(UserRole.USER)
export class BityLinkController {
  constructor(private bity: BityService) {}

  @Post('/refresh')
  async refresh(@CurrentUser() user: User) {
    if (user.token) {
      return this.bity.refreshBityToken(user.token);
    }
  }
}
