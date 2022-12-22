import {
  Args,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { OrderTemplate } from '../entities/OrderTemplate';
import { Order } from '../entities/Order';
import { OrderService } from './order.service';
import { CurrentUser, CurrentUserWithToken } from '../decorator/user.decorator';
import { User, UserWithToken } from '../entities/User';
import { OrderTemplateService } from './order.template.service';
import { CreateOrderInput, OrderInput } from '../dto/OrderInput';
import { MailerService } from '../emails/MailerService';
import { Vault } from '../entities/Vault';
import { VaultService } from '../vault/vault.service';
import { Dataloaders } from '../decorator/dataloader.decorator';
import { DLoaders } from '../dataloader/dataloaders';

@Resolver(() => OrderTemplate)
export class OrderResolver {
  constructor(
    private orderService: OrderService,
    private orderTemplateService: OrderTemplateService,
    private mailerService: MailerService,
    private vaultService: VaultService,
  ) {}

  @Query(() => OrderTemplate)
  orderTemplate(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.orderService.getOrderTemplate(user.id, id);
  }

  @ResolveField(() => Order, { nullable: true })
  async activeOrder(
    @CurrentUser() user: User,
    @Root() template: OrderTemplate,
    @Dataloaders() dataloaders: DLoaders,
  ): Promise<Order | null> {
    return dataloaders.latestActiveOrderByTemplateId.load(template.id);
  }

  @ResolveField(() => Vault)
  async vault(
    @CurrentUser() user: User,
    @Root() template: OrderTemplate,
    @Dataloaders() dataloaders: DLoaders,
  ): Promise<Vault> {
    return dataloaders.vaultById.load(template.vaultId);
  }

  @Mutation(() => OrderTemplate)
  async updateOrderTemplate(
    @CurrentUserWithToken() user: UserWithToken,
    @Args({ name: 'data', type: () => OrderInput }) data: OrderInput,
    @Args('orderTemplateId', { type: () => ID }) orderTemplateId: string,
  ): Promise<OrderTemplate> {
    const template = await this.orderTemplateService.getOrderTemplate(
      user,
      orderTemplateId,
    );

    const { newOrder, template: updatedTemplate } =
      await this.orderTemplateService.updateTemplate(user, template, data);
    if (newOrder) {
      await this.mailerService.sendNewOrderEmail(
        newOrder,
        user.email,
        user.locale,
      );
    }

    return updatedTemplate;
  }

  @Mutation(() => OrderTemplate)
  async createOrder(
    @CurrentUserWithToken() user: UserWithToken,
    @Args('vaultId', { type: () => ID }) vaultId: string,
    @Args('data', { type: () => CreateOrderInput }) data: CreateOrderInput,
  ): Promise<OrderTemplate> {
    const { template, newOrder } = await this.orderTemplateService.initTemplate(
      user,
      vaultId,
      data,
    );
    if (newOrder) {
      await this.mailerService.sendNewOrderEmail(
        newOrder,
        user.email,
        user.locale,
      );
    }
    return template;
  }

  @Mutation(() => OrderTemplate)
  async deleteOrderTemplate(
    @CurrentUserWithToken() user: UserWithToken,
    @Args('orderTemplateId', { type: () => ID }) orderTemplateId: string,
  ): Promise<OrderTemplate> {
    return this.orderTemplateService.deleteTemplate(user, orderTemplateId);
  }
}
