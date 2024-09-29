import { BadRequestException, Injectable } from '@nestjs/common';
import { IDataService } from '../../core/abstracts/data-service.abstract';
import { Document, Notification, User } from '../../frameworks/data-service/postgre/model';
import { Success } from '../../shared/types/Success.type';
import { ICacheService } from '../../core/abstracts/cache-service.abstract';

@Injectable()
export class NotificationUseCase {
  constructor(private dataService: IDataService, private cacheService: ICacheService) {
  }

  async notificate(user: User, document: Document): Promise<Notification> {
    const notification = this.dataService.notifications.create({ user, document });
    await this.cacheService.delete(`notification/${user.user_id}`);
    return await this.dataService.notifications.save(notification);
  }

  async getNotifications(user_id: string): Promise<Notification[]> {
    const cachedNotifications = await this.cacheService.get<Notification[]>(`notifications/${user_id}`);
    if (cachedNotifications) return cachedNotifications;
    const notifications = await this.dataService.notifications.find({
      where: { user: { user_id }, is_read: false },
      relations: ['document', 'user'],
      order: { created_at: 'DESC' },
    });
    await this.cacheService.set(`notifications/${user_id}`, notifications, 60);
    return notifications;
  }

  async readNotificate(notification_id: number, user_id: string): Promise<Success> {
    const notification = await this.dataService.notifications.findOneBy({ notification_id, user: { user_id } });
    if (!notification) {
      throw new BadRequestException('Notifiaction is not found');
    }
    notification.is_read = true;
    await this.dataService.notifications.save(notification);
    await this.cacheService.delete(`notifications/${user_id}`);
    return { success: true };
  }

}