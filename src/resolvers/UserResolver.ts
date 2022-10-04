import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/User';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(): Promise<User | null> {
    return Promise.resolve(null);
  }
}
