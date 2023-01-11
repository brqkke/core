import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, In, LessThan, Not, SelectQueryBuilder } from 'typeorm';
import { OrderStatus } from '../entities/enums/OrderStatus';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { buildRepositories, redactCryptoAddress, Repositories } from '../utils';
import { BityService } from '../bity/bity.service';
import { Token } from '../entities/Token';
import { Order, OrderSortFields, OrderSortInput } from '../entities/Order';
import { TokenStatus } from '../entities/enums/TokenStatus';
import { OrderTemplate } from '../entities/OrderTemplate';

export const IsOrderStatusActive = () =>
  In<OrderStatus>([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]);

@Injectable()
export class OrderService {
  private db: Repositories;
  constructor(
    private conn: DataSource,
    @Inject(forwardRef(() => BityService)) private bity: BityService,
  ) {
    this.db = buildRepositories(conn.manager);
  }

  async getMostRecentOrder(userId: string, onlyActive = false) {
    return this.db.order.findOne({
      where: {
        userId,
        ...(onlyActive
          ? { status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]) }
          : {}),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getVaultOrderTemplates(vaultId: string): Promise<OrderTemplate[]> {
    return this.db.orderTemplate.find({
      where: {
        vaultId,
        orders: {
          status: IsOrderStatusActive(),
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getActiveOrderForTemplate(templateId: string): Promise<Order | null> {
    return this.db.order.findOne({
      where: {
        orderTemplateId: templateId,
        status: IsOrderStatusActive(),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderTemplate(
    userId: string,
    orderTemplateId: string,
  ): Promise<OrderTemplate> {
    return this.db.orderTemplate.findOneOrFail({
      where: {
        vault: {
          userId,
        },
        id: orderTemplateId,
        orders: {
          status: In([
            OrderStatus.FILLED_NEED_RENEW,
            OrderStatus.OPEN,
            OrderStatus.CANCELLED,
          ]),
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersScheduledForCancellation(limit: number): Promise<Order[]> {
    return this.db.order.find({
      where: {
        status: OrderStatus.TO_CANCEL,
        user: {
          token: {
            status: TokenStatus.ACTIVE,
          },
        },
      },
      take: limit,
      relations: {
        user: {
          token: true,
        },
      },
    });
  }

  async getOrdersToCheck(
    limit: number,
    minimumCheckInterval: number,
  ): Promise<Order[]> {
    return this.db.order.find({
      where: {
        lastCheckedAt: LessThan(
          new Date(Date.now() - minimumCheckInterval * 1000),
        ),
        status: OrderStatus.OPEN,
        user: {
          token: {
            status: TokenStatus.ACTIVE,
          },
        },
      },
      take: limit,
      relations: {
        user: {
          token: true,
        },
      },
      order: {
        lastCheckedAt: 'ASC',
      },
    });
  }

  async getOrdersToRenew(limit: number): Promise<Order[]> {
    return this.db.order.find({
      where: {
        status: OrderStatus.FILLED_NEED_RENEW,
        user: {
          token: {
            status: TokenStatus.ACTIVE,
          },
        },
      },
      take: limit,
      relations: {
        user: {
          token: true,
        },
      },
      order: {
        lastCheckedAt: 'ASC',
      },
    });
  }

  async placeBityOrder({
    amount,
    cryptoAddress,
    token,
    currency,
    template,
    customPartnerFee,
  }: {
    currency: OrderCurrency;
    amount: number;
    cryptoAddress: string;
    token: Token;
    template: OrderTemplate;
    customPartnerFee: number | undefined;
  }) {
    const bityOrder = await this.bity.placeBityOrder({
      amount,
      currency,
      token,
      cryptoAddress,
      customPartnerFee,
    });
    if (bityOrder) {
      if (!bityOrder.payment_details?.reference) {
        throw new InternalServerErrorException({
          error: 'Order reference is undefined',
        });
      }
      const newOrder = this.db.order.create({
        remoteId: bityOrder.id,
        userId: token.userId,
        lastCheckedAt: new Date(),
        status: OrderStatus.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
        transferLabel: bityOrder.payment_details.reference,
        amount,
        currency,
        bankDetails: JSON.stringify(bityOrder.payment_details),
        redactedCryptoAddress: redactCryptoAddress(cryptoAddress),
        orderTemplateId: template.id,
      });
      await this.saveOrderAndTemplateAndSetOldOrderToCancelled(
        newOrder,
        template,
      );
      return newOrder;
    }

    return null;
  }

  protected saveOrderAndTemplateAndSetOldOrderToCancelled(
    order: Order,
    template: OrderTemplate,
  ) {
    return this.db.em.transaction('SERIALIZABLE', async (entityManager) => {
      const db = buildRepositories(entityManager);
      await db.order.save(order);
      await db.orderTemplate.save(template);
      await db.order.update(
        {
          userId: order.userId,
          id: Not(order.id),
          orderTemplateId: template.id,
          status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]),
        },
        { status: OrderStatus.CANCELLED },
      );
    });
  }

  public getAllUserOrdersQuery(userId: string): SelectQueryBuilder<Order> {
    return this.db.order.createQueryBuilder('o').where('o.userId = :userId', {
      userId,
    });
  }

  applySortOnQuery(
    query: SelectQueryBuilder<Order>,
    sort: OrderSortInput[],
  ): SelectQueryBuilder<Order> {
    const simpleFields: { [key in OrderSortFields]?: string } = {
      [OrderSortFields.CREATED_AT]: 'createdAt',
    };
    sort.forEach((sortItem) => {
      query.addOrderBy(
        `${query.alias}."${simpleFields[sortItem.sortBy]}"`,
        sortItem.order,
      );
    });

    return query;
  }

  applyReferenceSearchOnQuery(
    query: SelectQueryBuilder<Order>,
    reference: string,
  ): SelectQueryBuilder<Order> {
    return query.andWhere('o.transferLabel ILIKE :reference', {
      reference: `%${reference}%`,
    });
  }
}
