import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailLoginDTO } from '../dto/EmailLoginDTO';
import { DataSource } from 'typeorm';
import { RecaptchaService } from '../services/RecaptchaService';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

@Controller('auth')
export class AuthController {
  constructor(
    private db: DataSource,
    private recaptchaService: RecaptchaService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login/email')
  async emailLogin(@Body() body: EmailLoginDTO): Promise<boolean> {
    const validCaptcha = await this.recaptchaService.verifyCaptcha(
      body.captchaToken,
    );

    if (!validCaptcha) {
      throw new BadRequestException('Captcha is invalid');
    }

    const user = await this.userService.findUserOrInit(body.email);
    await this.authService.sendUserLoginLink(user);

    return true;
  }
}
