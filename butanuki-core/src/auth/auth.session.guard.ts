import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { AuthService } from './AuthService';
import { User } from '../entities/User';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IncomingMessage & { user: User }>();

    const token = this.extractTokenFromRequest(request);
    if (token) {
      const user = await this.authService.authenticateUser(token);
      if (user) {
        request.user = user;
      }
    }

    return true;
  }

  protected extractTokenFromRequest(
    request: IncomingMessage & { user: User },
  ): string | null {
    const headers = request.headers;
    return headers.authorization || null;
  }
}
