import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, In, LessThan, Not } from 'typeorm';
import { OrderStatus } from '../entities/enums/OrderStatus';
import { OrderCurrency } from '../entities/enums/OrderCurrency';
import { buildRepositories, redactCryptoAddress, Repositories } from '../utils';
import { BityService } from '../bity/bity.service';
import { Token } from '../entities/Token';
import { Order } from '../entities/Order';
import { TokenStatus } from '../entities/enums/TokenStatus';

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

  async getMostRecentActiveOrder(userId: string) {
    return this.getMostRecentOrder(userId, true);
  }

  async openOrdersAlreadyExists({
    currency,
    userId,
    amount,
  }: {
    currency: OrderCurrency;
    userId: string;
    amount: number;
  }) {
    return await this.db.order.count({
      where: {
        currency,
        userId,
        amount,
        status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]),
      },
    });
  }

  async placeBityOrder({
    amount,
    cryptoAddress,
    token,
    currency,
  }: {
    currency: OrderCurrency;
    amount: number;
    cryptoAddress: string;
    token: Token;
  }) {
    const bityOrder = await this.bity.placeBityOrder({
      amount,
      currency,
      token,
      cryptoAddress,
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
      });
      await this.saveOrderAndSetOldToCancelled(newOrder);
      return newOrder;
    }

    return null;
  }

  protected saveOrderAndSetOldToCancelled(order: Order) {
    return this.db.em.transaction('SERIALIZABLE', async (entityManager) => {
      const db = buildRepositories(entityManager);
      await db.order.save(order);
      await db.order.update(
        {
          userId: order.userId,
          id: Not(order.id),
          status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]),
        },
        { status: OrderStatus.CANCELLED },
      );
    });
  }
}
