import { registerEnumType } from '@nestjs/graphql';
import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

export enum ErrorType {
  NeedVerifiedBityAccount = 'NeedVerifiedBityAccount',
  CantRefreshBityToken = 'CantRefreshBityToken',
  ButanukiAccountPreviouslyLinkedToOtherBityAccount = 'ButanukiAccountPreviouslyLinkedToOtherBityAccount',
  UnknownBityError = 'UnknownBityError',
  Unknown = 'Unknown',
}

registerEnumType(ErrorType, {
  name: 'ErrorType',
  description: 'Error type',
});

export const makeError = (code: ErrorType): HttpException => {
  switch (code) {
    case ErrorType.NeedVerifiedBityAccount:
    case ErrorType.ButanukiAccountPreviouslyLinkedToOtherBityAccount:
      return new ConflictException(code);
    case ErrorType.CantRefreshBityToken:
      return new InternalServerErrorException(code);
    case ErrorType.UnknownBityError:
    case ErrorType.Unknown:
      return new InternalServerErrorException(code);
    default:
      return new InternalServerErrorException(ErrorType.Unknown);
  }
};
