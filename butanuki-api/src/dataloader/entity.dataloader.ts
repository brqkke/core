import DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { NotFoundException } from '@nestjs/common';

type Entity = { id: string } & ObjectLiteral;

export function createEntityDataloader<E extends Entity>(
  repository: Repository<E>,
) {
  return new DataLoader<string, E>(async (ids: string[]) => {
    const q = repository.createQueryBuilder('e');
    q.andWhere(`e."id" IN (:...ids)`, { ids });
    const data = await q.getMany();
    const map = data.reduce((map, current) => {
      map.set(current.id, current);
      return map;
    }, new Map<string, E>());

    return ids.map(
      (id) =>
        map.get(id) ||
        new NotFoundException({
          error: 'Entity not found',
          id,
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
