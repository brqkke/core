import {
  ConflictException,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../entities/enums/UserRole';
import { ContextType } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IncomingMessage } from 'http';
import { User } from '../entities/User';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getRequestFromExecutionContext(ctx);
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return request.user;
  },
);

export const CurrentUserWithToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getRequestFromExecutionContext(ctx);
    if (!request.user) {
      throw new UnauthorizedException();
    }
    if (!request.user?.token) {
      throw new ConflictException({
        success: false,
        error: 'Bity not linked',
      });
    }
    return request.user;
  },
);

export const getRequestFromExecutionContext = (
  ctx: ExecutionContext,
): IncomingMessage & { user?: User } => {
  switch (ctx.getType<ContextType | 'graphql'>()) {
    case 'http':
      return ctx.switchToHttp().getRequest();
    case 'graphql':
      return GqlExecutionContext.create(ctx).getContext().req;
    default:
      throw new Error("can't extract request from ctx");
  }
};

export const ROLES_KEY = 'ROLES_KEY';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
