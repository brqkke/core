import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailLoginDTO, EmailLoginVerifyDTO } from '../dto/EmailLoginDTO';
import { DataSource } from 'typeorm';
import { RecaptchaService } from '../services/RecaptchaService';
import { UserService } from '../user/user.service';
import { User } from '../entities/User';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { UserRole } from '../entities/enums/UserRole';
import { AuthService } from './AuthService';
import { MfaService } from '../mfa/mfa.service';
import { I18nService } from '../i18n/i18n.service';

@Controller('auth')
export class AuthController {
  constructor(
    private db: DataSource,
    private recaptchaService: RecaptchaService,
    private authService: AuthService,
    private userService: UserService,
    private mfaService: MfaService,
    private i18nService: I18nService,
  ) {}

  @Post('login/email')
  async emailLogin(@Body() body: EmailLoginDTO) {
    const validCaptcha = await this.recaptchaService.verifyCaptcha(
      body.captchaToken,
    );

    if (!validCaptcha) {
      throw new BadRequestException(
        { success: false, error: 'captcha' },
        'Captcha is invalid',
      );
    }
    let locale = body.locale || 'en';
    if (!this.i18nService.isLanguageSupported(locale)) {
      locale = 'en';
    }
    const user = await this.userService.findUserOrInit({
      email: body.email,
      locale,
    });
    await this.authService.sendUserLoginLink(user, locale);

    return {
      success: true,
    };
  }

  @Post('login/email/verify')
  async emailLoginVerify(@Body() body: EmailLoginVerifyDTO): Promise<{
    success: boolean;
    sessionToken: string;
    user: { email: string };
  }> {
    const user = await this.userService.findUserWithLoginToken(
      body.tempCode,
      body.email,
      !!body.mfaCode,
    );

    if (!user) {
      throw new UnauthorizedException({ error: 'token' });
    }

    if (body.mfaCode && user.mfaSecret) {
      const mfaValid = this.mfaService.verifyMfa({
        mfaCode: body.mfaCode,
        mfaSecret: user.mfaSecret,
      });

      if (!mfaValid) {
        throw new UnauthorizedException({ error: 'mfa' });
      }
    }

    const session = await this.authService.createUserSession(user);
    user.tempCodeExpireAt = 0;
    await this.db.getRepository(User).save(user);

    return {
      success: true,
      sessionToken: session.token,
      user: { email: user.email },
    };
  }

  @Get('me')
  @Roles(UserRole.USER)
  async me(
    @CurrentUser() user?: User,
  ): Promise<{ email: string; locale: string } | null> {
    return user ? { email: user.email, locale: user.locale } : null;
  }
}
