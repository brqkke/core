import { Controller } from '@nestjs/common';
import { BityService } from './bity.service';
import { Roles } from '../decorator/user.decorator';
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
}
