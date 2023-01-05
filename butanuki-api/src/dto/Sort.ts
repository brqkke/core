import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Sort, {
  name: 'Sort',
});

export const SortedInput = <T extends object>(fieldsEnum: T) => {
  @InputType({ isAbstract: true })
  abstract class SortedInput {
    @Field(() => Sort, { defaultValue: Sort.ASC })
    order: Sort;

    @Field(() => fieldsEnum)
    sortBy: T[keyof T];
  }

  return SortedInput;
};
