import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UserRole } from '../entities/enums/UserRole';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { OrderService } from '../order/order.service';
import { User } from '../entities/User';
import { Order } from '../entities/Order';
import { SetOrderDTO } from '../dto/SetOrderDTO';
import { BityService } from './bity.service';
import { MailerService } from '../emails/MailerService';

@Controller('bity/order')
@Roles(UserRole.USER)
export class BityOrderController {
  constructor(
    private orderService: OrderService,
    private bity: BityService,
    private mailer: MailerService,
  ) {}

  @Get('/')
  async order(@CurrentUser() user: User) {
    const order = await this.orderService.getMostRecentActiveOrder(user.id);
    if (order) {
      return {
        order: {
          amount: order.amount,
          currency: order.currency,
          reference: order.transferLabel,
          bankDetails: JSON.parse(order.bankDetails || 'null'),
          redactedCryptoAddress: order.redactedCryptoAddress,
        },
      };
    }

    throw new NotFoundException();
  }

  @Put('/')
  async setOrder(
    @CurrentUser() user: User,
    @Body() { amount, currency, cryptoAddress }: SetOrderDTO,
  ): Promise<Order | null> {
    if (!user.token) {
      throw new BadRequestException({
        success: false,
        error: 'Bity not linked',
      });
    }

    if (
      !cryptoAddress &&
      (await this.orderService.openOrdersAlreadyExists({
        amount,
        currency,
        userId: user.id,
      }))
    ) {
      return null;
    }

    if (!cryptoAddress) {
      throw new BadRequestException({
        success: false,
        error: 'You need to provide a destination address',
      });
    }
    const newOrder = await this.orderService.placeBityOrder({
      amount,
      currency,
      cryptoAddress,
      token: user.token,
    });
    if (!newOrder) {
      throw new InternalServerErrorException();
    }
    await this.mailer.sendNewOrderEmail(newOrder, user.email);
    return newOrder;
  }
}
