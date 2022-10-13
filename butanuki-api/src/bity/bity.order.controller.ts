import { Controller, Get, NotFoundException } from '@nestjs/common';
import { UserRole } from '../entities/enums/UserRole';
import { CurrentUser, Roles } from '../decorator/user.decorator';
import { OrderService } from '../order/order.service';
import { User } from '../entities/User';
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
}
