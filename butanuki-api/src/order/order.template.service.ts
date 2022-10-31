import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { buildRepositories, Repositories } from '../utils';
import { User, UserWithToken } from '../entities/User';
import { OrderTemplate } from '../entities/OrderTemplate';
import { BityService } from '../bity/bity.service';
import { OrderService } from './order.service';
import { Order } from '../entities/Order';
import { CreateOrderInput, OrderInput } from '../dto/OrderInput';
import { VaultService } from '../vault/vault.service';
import { OrderStatus } from '../entities/enums/OrderStatus';

@Injectable()
export class OrderTemplateService {
  private db: Repositories;
  constructor(
    private conn: DataSource,
    private bityService: BityService,
    private orderService: OrderService,
    private vaultService: VaultService,
  ) {
    this.db = buildRepositories(conn.manager);
  }

  async initTemplate(
    user: UserWithToken,
    vaultId: string,
    data: CreateOrderInput,
  ): Promise<{ template: OrderTemplate; newOrder: Order }> {
    const vault = await this.vaultService.findUserVault(user, vaultId);
    const template = await this.db.orderTemplate.save({
      name: data.name,
      vaultId,
      currency: vault.currency,
      amount: data.amount,
      createdAt: new Date(),
    });
    try {
      const newOrder = await this.orderService.placeBityOrder({
        amount: template.amount,
        template,
        token: user.token,
        currency: template.currency,
        cryptoAddress: data.cryptoAddress,
      });
      if (!newOrder) {
        throw new InternalServerErrorException("Can't create order");
      }
      return { template, newOrder };
    } catch (e) {
      await this.db.orderTemplate.remove(template);
      throw e;
    }
  }

  async updateTemplate(
    user: UserWithToken,
    template: OrderTemplate,
    data: OrderInput,
  ): Promise<{ template: OrderTemplate; newOrder: Order | null }> {
    template.name = data.name || template.name;
    if (!data.cryptoAddress && data.amount && data.amount !== template.amount) {
      throw new BadRequestException({
        success: false,
        error: 'You need to provide a destination address',
      });
    } else if (data.cryptoAddress) {
      template.amount = data.amount ?? template.amount;
      const newOrder = await this.orderService.placeBityOrder({
        amount: template.amount,
        template,
        token: user.token,
        currency: template.currency,
        cryptoAddress: data.cryptoAddress,
      });
      if (!newOrder) {
        throw new InternalServerErrorException(
          "Can't create new order on Bity",
        );
      }
      return { template, newOrder };
    }
    await this.db.orderTemplate.save(template);
    return { template, newOrder: null };
  }

  async getOrderTemplate(user: User, templateId: string) {
    return this.db.orderTemplate.findOneByOrFail({
      id: templateId,
      vault: {
        userId: user.id,
      },
    });
  }

  async deleteTemplate(user: User, templateId: string) {
    return this.db.em.transaction('SERIALIZABLE', async (em) => {
      const db = buildRepositories(em);
      await db.order.update(
        {
          orderTemplateId: templateId,
          status: In([OrderStatus.FILLED_NEED_RENEW, OrderStatus.OPEN]),
        },
        { status: OrderStatus.CANCELLED },
      );
      const template = await this.getOrderTemplate(user, templateId);
      return db.orderTemplate.softRemove(template);
    });
  }
}
