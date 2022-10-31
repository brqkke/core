import { Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from './ErrorTypes';

@Resolver()
export class ErrorResolver {
  @Query(() => [ErrorType])
  errors(): ErrorType[] {
    return Object.values(ErrorType);
  }
}
