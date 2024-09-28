import { Module } from '@nestjs/common';
import { DataServiceModule } from '../../services/data-service/data-service.module';
import { NotificationUseCase } from './notification.use-case';
import { CacheServiceModule } from '../../services/cache-service/cache-service.module';

@Module({
  imports: [DataServiceModule, CacheServiceModule],
  providers: [NotificationUseCase ],
  exports: [NotificationUseCase],
})
export class NotificationUseCasesModule {
}