import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationUseCase } from '../use-cases/notification/notification.use-case';
import { JwtGuard } from '../use-cases/auth/guards/jwt.guard';
import { getUserId } from '../use-cases/auth/decorators/getUserId';

@Controller('notification')
export class NotificationController {
  constructor(private notificationUseCase: NotificationUseCase){}

  @Get()
  @UseGuards(JwtGuard)
  async getNotifications(@getUserId() id: string) {
    return this.notificationUseCase.getNotifications(id);
  }

  @Put(":id")
  @UseGuards(JwtGuard)
  async readNotification(@getUserId() user_id: string, @Param("id") id : string) {
    return this.notificationUseCase.readNotificate(+id, user_id);
  }

}