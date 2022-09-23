import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { CurrentUser } from '../decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private datasource: DataSource) {}

  @Get('me')
  async me(
    @CurrentUser() user?: User,
  ): Promise<{ user: { email: string } | null }> {
    console.log('hhhh');
    return { user: user ? { email: user.email } : null };
  }
}
