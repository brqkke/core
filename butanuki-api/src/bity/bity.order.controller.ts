import { Controller } from '@nestjs/common';
import { UserRole } from '../entities/enums/UserRole';
import { Roles } from '../decorator/user.decorator';
import { OrderService } from '../order/order.service';
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
}
