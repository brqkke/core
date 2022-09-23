import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as querystring from 'querystring';
import { lastValueFrom } from 'rxjs';
import { AppConfigService } from './ConfigService';

@Injectable()
export class RecaptchaService {
  constructor(private config: AppConfigService, private http: HttpService) {}

  async verifyCaptcha(token: string): Promise<boolean> {
    return true;
    const r = await lastValueFrom(
      this.http.post(
        'https://www.google.com/recaptcha/api/siteverify',
        querystring.stringify({
          secret: this.config.config.recaptcha.secret,
          response: token,
        }),
      ),
    );
    console.log(r);
    return r.data.success === true;
  }
}
