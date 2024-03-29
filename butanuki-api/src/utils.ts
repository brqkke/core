import { EntityManager } from 'typeorm';
import { User } from './entities/User';
import { Token } from './entities/Token';
import { Order } from './entities/Order';
import { Session } from './entities/Session';
import { Task } from './entities/Task';
import { EventLog } from './entities/EventLog';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { TokenHistory } from './entities/TokenHistory';
import { Vault } from './entities/Vault';
import { OrderTemplate } from './entities/OrderTemplate';
import { Rate } from './entities/Rate';
import { HistoricalRate } from './entities/HistoricalRate';

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
    task: manager.getRepository(Task),
    eventLog: manager.getRepository(EventLog),
    tokenHistory: manager.getRepository(TokenHistory),
    vault: manager.getRepository(Vault),
    orderTemplate: manager.getRepository(OrderTemplate),
    rate: manager.getRepository(Rate),
    historicalRate: manager.getRepository(HistoricalRate),
  };
}

export function redactCryptoAddress(address: string) {
  return address.substr(0, 5) + '...' + address.substr(-5);
}

type EntityClass = {
  id: string;
};

export function acquireLockOnEntity<Entity extends ObjectLiteral & EntityClass>(
  target: EntityTarget<Entity>,
  entityId: string,
  em: EntityManager,
) {
  const valueForId = `${em.getRepository(target).metadata.name}${entityId}`;
  return em.query(
    `SELECT pg_advisory_xact_lock(hashtext($1)), hashtext($1) AS hash_key`,
    [valueForId],
  );
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function base32Encode(buffer: Buffer): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const binary = [...buffer]
    .map((byte) => {
      return byte.toString(2).padStart(8, '0');
    })
    .join('');
  const fiveBitInts = [];
  for (let i = 0; i < binary.length; i += 5) {
    fiveBitInts.push(binary.slice(i, i + 5));
  }
  return fiveBitInts
    .map((fiveBitInt) => {
      const decimal = parseInt(fiveBitInt, 2);
      return base32Chars[decimal];
    })
    .join('');
}

export function base32Decode(base32: string): Buffer {
  const base32Chars = Object.fromEntries(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('').map((c, i) => [c, i]),
  );

  const binary = [...base32]
    .map((char) => {
      const decimal = base32Chars[char];
      return decimal.toString(2).padStart(5, '0');
    })
    .join('');
  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(binary.slice(i, i + 8));
  }
  return Buffer.from(bytes.map((byte) => parseInt(byte, 2)));
}
