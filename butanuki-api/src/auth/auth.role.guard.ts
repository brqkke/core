import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './AuthService';
import { User } from '../entities/User';
import { Reflector } from '@nestjs/core';
import {
  getRequestFromExecutionContext,
  ROLES_KEY,
} from '../decorator/user.decorator';
import { roleHierarchy, UserRole } from '../entities/enums/UserRole';
import { IncomingMessage } from 'http';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = getRequestFromExecutionContext(context);
    const { user } = request;

    if (!user) {
      return false;
    }
    const userEffectiveRoles = roleHierarchy(user.role);
    return requiredRoles.some((role) => userEffectiveRoles.includes(role));
  }
}
