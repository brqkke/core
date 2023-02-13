import { Injectable } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { AppConfigService } from '../config/app.config.service';

type AlertLevel = 'info' | 'success' | 'error' | 'warning' | 'critical';
type AlertChannel = 'telegram';

@Injectable()
export class AlertService {
  constructor(
    private telegramService: TelegramService,
    private config: AppConfigService,
  ) {}

  private makeMessage(level: AlertLevel, message: string) {
    return `[${this.levelToEmoji(level)} ${
      this.config.config.envName
    }] ${message}`;
  }

  private levelToEmoji(level: AlertLevel) {
    switch (level) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'critical':
        return '🚨';
    }
  }

  async send(level: AlertLevel, message: string, channel: AlertChannel) {
    switch (channel) {
      case 'telegram':
        return this.telegramService.sendMessage(
          this.makeMessage(level, message),
        );
      default:
        throw new Error(`Unknown channel ${channel}`);
    }
  }
}
