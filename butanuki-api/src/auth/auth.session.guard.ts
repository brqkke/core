import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { AuthService } from './AuthService';
import { User } from '../entities/User';
import { getRequestFromExecutionContext } from '../decorator/user.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequestFromExecutionContext(context);
    const token = this.extractTokenFromRequest(request);
    if (token && !request.user) {
      // if we already have a user, we don't need to check the token. This avoid checking for each field resolver
      const user = await this.authService.authenticateUser(token);
      if (user) {
        request.user = user;
      }
    }

    return true;
  }

  protected extractTokenFromRequest(
    request: IncomingMessage & { user?: User },
  ): string | null {
    const headers = request.headers;
    return headers.authorization || null;
  }
}
