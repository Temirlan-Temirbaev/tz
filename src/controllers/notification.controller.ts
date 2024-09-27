import { Controller } from '@nestjs/common';
import { NotificationUseCase } from '../use-cases/notification/notification.use-case';

@Controller('notification')
export class NotificationController {
  constructor(private notificationUseCase: NotificationUseCase){}
}