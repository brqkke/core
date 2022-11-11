import DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { NotFoundException } from '@nestjs/common';

type Entity = { id: string } & ObjectLiteral;

export function createEntityDataloader<E extends Entity>(
  repository: Repository<E>,
  key: keyof E = 'id',
) {
  return new DataLoader<string, E>(async (keys: string[]) => {
    const q = repository.createQueryBuilder('e');
    q.andWhere(`e."${String(key)}" IN (:...keys)`, { keys });
    const data = await q.getMany();
    const map = data.reduce((map, current) => {
      map.set(current[key], current);
      return map;
    }, new Map<string, E>());

    return keys.map(
      (key) =>
        map.get(key) ||
        new NotFoundException({
          error: 'Entity not found',
          key,
          entity: repository.metadata.name,
        }),
    );
  });
}

export function createEntitiesDataloader<E extends Entity>(
  repository: Repository<E>,
  field: keyof E,
) {
  return new DataLoader<string, E[]>(async (ids: string[]) => {
    const q = repository.createQueryBuilder('e');
    q.andWhere(`e."${field.toString()}" IN (:...ids)`, { ids });

    const data = await q.getMany();

    const map = data.reduce((map, current) => {
      if (map.has(current[field])) {
        map.get(current[field])?.push(current);
      } else {
        map.set(current[field], [current]);
      }
      return map;
    }, new Map<string, E[]>());

    return ids.map((id) => map.get(id) || []);
  });
}
