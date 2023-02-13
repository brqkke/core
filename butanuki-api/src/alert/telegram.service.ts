import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfigService } from '../config/app.config.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
  constructor(
    private httpService: HttpService,
    private config: AppConfigService,
  ) {}

  private get baseUrl() {
    return `https://api.telegram.org/bot${this.config.config.alert.telegram.apiKey}`;
  }

  private get chatId() {
    return this.config.config.alert.telegram.chatId;
  }

  private doRequest(method: string, data: any) {
    return firstValueFrom(
      this.httpService.post(`${this.baseUrl}/${method}`, data),
    );
  }

  async sendMessage(message: string) {
    return this.doRequest('sendMessage', {
      chat_id: this.chatId,
      text: message,
    });
  }
}
