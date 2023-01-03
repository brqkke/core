import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Pagination, PaginationInput } from '../dto/Paginated';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

interface PaginatedResponse<T> {
  pagination: Pagination;
  items: T[];
}

export class PaginationService {
  constructor(private readonly db: DataSource) {}

  async paginate<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    input: PaginationInput,
  ): Promise<PaginatedResponse<T>> {
    const [items, count] = await query
      .skip(input.page * input.count)
      .take(input.count)
      .getManyAndCount();
    const lastPage = Math.ceil(count / input.count) - 1; // 0 based
    const nextPage = Math.min(input.page + 1, lastPage);
    const previousPage = Math.max(input.page - 1, 0);
    const pagination: Pagination = {
      page: input.page,
      count,
      pages: Math.ceil(count / input.count),
      firstPage: 0,
      lastPage,
      nextPage,
      previousPage,
    };
    return {
      pagination,
      items,
    };
  }
}
