import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/User';
import { Type } from '@nestjs/common/interfaces/type.interface';

export const Paginated = <T>(t: Type<T>) => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedObject {
    @Field(() => Int)
    count: number;

    @Field(() => [t])
    items: T[];
  }

  return PaginatedObject;
};

@InputType('PaginationInput')
export class PaginationInput {
  @Field(() => Int, { defaultValue: 0 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  count: number;
}

@ObjectType()
export class PaginatedUser extends Paginated(User) {}
