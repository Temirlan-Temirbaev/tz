import { Module } from '@nestjs/common';
import { DataServiceModule } from '../../services/data-service/data-service.module';
import { FileServiceModule } from '../../services/file-service/file-service.module';
import { DocumentUseCase } from './document.use-case';
import { NotificationUseCasesModule } from '../notification/notification.use-cases.module';
import { CacheServiceModule } from '../../services/cache-service/cache-service.module';

@Module({
  imports: [DataServiceModule, FileServiceModule, NotificationUseCasesModule, CacheServiceModule],
  providers: [DocumentUseCase],
  exports: [DocumentUseCase]
})
export class DocumentUseCasesModule{}