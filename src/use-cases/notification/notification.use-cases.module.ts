import { Module } from '@nestjs/common';
import { DataServiceModule } from '../../services/data-service/data-service.module';
import { FileServiceModule } from '../../services/file-service/file-service.module';
import { NotificationUseCase } from './notification.use-case';

@Module({
  imports: [DataServiceModule, FileServiceModule],
  providers: [NotificationUseCase ],
  exports: [NotificationUseCase],
})
export class NotificationUseCasesModule {
}