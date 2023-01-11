import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/User';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { Order } from '../entities/Order';

@ObjectType('Pagination')
export class Pagination {
  @Field(() => Int)
  count: number; // total number of items

  @Field(() => Int)
  page: number; // current page

  @Field(() => Int)
  pages: number; // total number of pages

  @Field(() => Int)
  firstPage: number; // first page

  @Field(() => Int)
  lastPage: number; // last page

  @Field(() => Int)
  nextPage: number; // next page

  @Field(() => Int)
  previousPage: number; // previous page
}

export const Paginated = <T>(t: Type<T>) => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedObject {
    @Field(() => Pagination)
    pagination: Pagination;

    @Field(() => [t])
    items: T[];
  }

  return PaginatedObject;
};

@InputType('PaginationInput')
export class PaginationInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class PaginatedUser extends Paginated(User) {}

@ObjectType()
export class PaginatedOrder extends Paginated(Order) {}
