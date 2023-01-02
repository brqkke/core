import { DataSource, SelectQueryBuilder } from 'typeorm';
import { PaginationInput } from '../dto/Paginated';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

interface PaginatedResponse<T> {
  count: number;
  items: T[];
}

export class PaginationService {
  constructor(private readonly db: DataSource) {}

  async paginate<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    pagination: PaginationInput,
  ): Promise<PaginatedResponse<T>> {
    const [items, count] = await query
      .skip(pagination.page * pagination.count)
      .take(pagination.count)
      .getManyAndCount();

    return {
      count,
      items,
    };
  }
}
