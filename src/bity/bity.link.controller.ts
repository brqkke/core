import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
} from '@nestjs/common';
import { BityService } from './bity.service';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { User } from '../entities/User';
import { TokenStatus } from '../entities/enums/TokenStatus';
import { UserRole } from '../entities/enums/UserRole';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class BityLinkCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  redirectedFrom: string;
}

@Controller('bity/link')
@Roles(UserRole.USER)
export class BityLinkController {
  constructor(private bity: BityService) {}

  @Get('/')
  async linkUrl() {
    return { redirectUrl: this.bity.getBityLoginUrl() };
  }

  @Get('status')
  async linkStatus(
    @CurrentUser() user: User,
  ): Promise<{ linked: boolean; linkStatus: TokenStatus | null }> {
    const token = user.token;
    return {
      linked: !!token,
      linkStatus: token?.status || null,
    };
  }

  @Post('code')
  async bityLinkCode(@CurrentUser() user: User, @Body() body: BityLinkCodeDTO) {
    const token = await this.bity.getTokenFromCodeRedirectUrl(
      body.redirectedFrom,
    );
    if (!token || token.expired()) {
      throw new BadRequestException({ success: false });
    }

    await this.bity.useTokenOnUser(token, user);
    return { success: true };
  }

  @Delete('/')
  @HttpCode(204)
  async removeBityLink(@CurrentUser() user: User) {
    if (user.token) {
      await this.bity.removeToken(user);
    }
  }
}
