import { Body, Controller, Put } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { User } from '../entities/User';
import { DataSource } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { UserRole } from '../entities/enums/UserRole';

class UpdateLocaleDTO {
  @ApiProperty()
  @IsNotEmpty()
  locale: string;
}

@Controller('user')
export class UserController {
  private db: Repositories;
  constructor(db: DataSource) {
    this.db = buildRepositories(db.manager);
  }

  @Put('me/locale')
  @Roles(UserRole.USER)
  async updateLocale(@Body() body: UpdateLocaleDTO, @CurrentUser() user: User) {
    if (['fr', 'en'].includes(body.locale)) {
      user.locale = body.locale;
      await this.db.user.save(user);
    }
    return { locale: user.locale };
  }
}
