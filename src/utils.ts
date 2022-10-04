import { EntityManager } from 'typeorm';
import { User } from './entities/User';
import { Token } from './entities/Token';
import { Order } from './entities/Order';
import { Session } from './entities/Session';

export function genRandomString(length: number) {
  const list = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array(length)
    .fill('_')
    .map((_) => list[Math.round(Math.random() * list.length)])
    .join('');
}

export type Repositories = ReturnType<typeof buildRepositories>;

export function buildRepositories(manager: EntityManager) {
  return {
    em: manager,
    user: manager.getRepository(User),
    order: manager.getRepository(Order),
    token: manager.getRepository(Token),
    session: manager.getRepository(Session),
  };
}

export function redactCryptoAddress(address: string) {
  return address.substr(0, 5) + '...' + address.substr(-5);
}
