import { QueryResultCache } from 'typeorm/cache/QueryResultCache';
import { QueryRunner } from 'typeorm';
import { QueryResultCacheOptions } from 'typeorm/cache/QueryResultCacheOptions';

export class InMemoryCache implements QueryResultCache {
  private cache = new Map<string, QueryResultCacheOptions>();

  clear(queryRunner?: QueryRunner): Promise<void> {
    this.cache.clear();
    return Promise.resolve();
  }

  connect(): Promise<void> {
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  getFromCache(
    options: QueryResultCacheOptions,
    queryRunner?: QueryRunner,
  ): Promise<QueryResultCacheOptions | undefined> {
    return Promise.resolve(this.cache.get(options.identifier));
  }

  isExpired(savedCache: QueryResultCacheOptions): boolean {
    return savedCache.time! + savedCache.duration < Date.now();
  }

  remove(identifiers: string[], queryRunner?: QueryRunner): Promise<void> {
    return Promise.resolve(undefined);
  }

  storeInCache(
    options: QueryResultCacheOptions,
    savedCache: QueryResultCacheOptions | undefined,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    this.cache.set(options.identifier, options);
    return Promise.resolve();
  }

  synchronize(queryRunner?: QueryRunner): Promise<void> {
    return Promise.resolve(undefined);
  }
}
