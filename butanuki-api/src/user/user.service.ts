import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import { SortUserInput, User, UserSortFields } from '../entities/User';
import { UserStatus } from '../entities/enums/UserStatus';
import { Order } from '../entities/Order';
import { OrderStatus } from '../entities/enums/OrderStatus';
import { UserFilterInput } from '../dto/UserFilter';
import { isNil } from 'lodash';
import { Token } from '../entities/Token';
import { TokenStatus } from '../entities/enums/TokenStatus';

@Injectable()
export class UserService {
  private repository: Repository<User>;
  constructor(db: DataSource) {
    this.repository = db.getRepository(User);
  }

  async findUserOrInit({
    email,
    locale,
  }: {
    email: string;
    locale: string;
  }): Promise<User> {
    const lowerCaseEmail = email.toLowerCase();
    let user = await this.repository.findOneBy({
      email: lowerCaseEmail,
      status: UserStatus.ACTIVE,
    });
    if (user) {
      return user;
    }
    user = new User();
    user.email = lowerCaseEmail;
    user.locale = locale;
    return this.repository.save(user);
  }

  async findUserWithLoginToken(
    tempCode: string,
    email: string,
    withMfa: boolean,
  ): Promise<User | null> {
    return this.repository.findOneBy({
      email,
      tempCode,
      tempCodeExpireAt: MoreThan(Math.floor(Date.now() / 1000)),
      status: UserStatus.ACTIVE,
      mfaEnabled: withMfa,
    });
  }

  async setupMfa(user: User, mfaSecret: string): Promise<void> {
    user.mfaSecret = mfaSecret;
    await this.repository.save(user);
  }

  async removeMfa(user: User): Promise<void> {
    user.mfaSecret = null;
    await this.repository.save(user);
  }

  applySearchOnQuery(
    query: SelectQueryBuilder<User>,
    search: string,
  ): SelectQueryBuilder<User> {
    query.andWhere(`"${query.alias}".email ILIKE '%'||:search||'%'`, {
      search,
    });
    return query;
  }

  applyFiltersOnQuery(
    query: SelectQueryBuilder<User>,
    filters: UserFilterInput,
  ): SelectQueryBuilder<User> {
    if (!isNil(filters.hasActiveBityToken)) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('t."userId"')
            .from(Token, 't')
            .where(`t.status = :tokenStatus`)
            .getQuery();
          if (filters.hasActiveBityToken) {
            return `${query.alias}.id IN ${subQuery}`;
          } else {
            return `${query.alias}.id NOT IN ${subQuery}`;
          }
        },
        { tokenStatus: TokenStatus.ACTIVE },
      );
    }
    if (!isNil(filters.hasOrders)) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('o."userId"')
            .distinctOn(['o."userId"'])
            .from(Order, 'o')
            .where(`o.status = :orderStatus`)
            .getQuery();
          if (filters.hasOrders) {
            return `${query.alias}.id IN ${subQuery}`;
          } else {
            return `${query.alias}.id NOT IN ${subQuery}`;
          }
        },
        { orderStatus: OrderStatus.OPEN },
      );
    }

    return query;
  }

  applySortOnQuery(
    query: SelectQueryBuilder<User>,
    sort: SortUserInput[],
  ): SelectQueryBuilder<User> {
    const simpleFields: { [key in UserSortFields]?: string } = {
      [UserSortFields.EMAIL]: 'email',
      [UserSortFields.CREATED_AT]: 'createdAt',
      [UserSortFields.ROLE]: 'role',
    };
    console.log('sort', sort);
    sort.forEach(({ sortBy, order }, i) => {
      if (sortBy in simpleFields) {
        console.log(
          'simpleFields[sortBy]',
          simpleFields[sortBy],
          `${query.alias}."${simpleFields[sortBy]}"`,
        );
        query.addOrderBy(`${query.alias}."${simpleFields[sortBy]}"`, order);
        return;
      }
      switch (sortBy) {
        case UserSortFields.BITY_STATUS:
          query.leftJoin(
            `${query.alias}.token`,
            `token_${i}`,
            `token_${i}."userId" = ${query.alias}.id`,
          );
          query.addOrderBy(`token_${i}.status`, order);
          break;
        case UserSortFields.HAS_OPEN_ORDERS:
          query
            .addSelect((qb) => {
              return qb
                .select('COUNT(*) > 0', 'hasOpenOrders')
                .from(Order, `order_${i}`)
                .where(
                  `order_${i}."userId" = "${query.alias}".id AND order_${i}.status = :status${i}`,
                  {
                    [`status${i}`]: OrderStatus.OPEN,
                  },
                );
            })
            .addOrderBy(`"hasOpenOrders"`, order);
          break;
        default:
          throw new Error(`Unknown sort field: ${sortBy}`);
      }
    });
    return query;
  }
}
