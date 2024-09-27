import { Module } from '@nestjs/common';
import { DataServiceModule } from '../../services/data-service/data-service.module';
import { FileServiceModule } from '../../services/file-service/file-service.module';
import { DocumentUseCase } from './document.use-case';

@Module({
  imports: [DataServiceModule, FileServiceModule],
  providers: [DocumentUseCase],
  exports: [DocumentUseCase]
})
export class DocumentUseCasesModule{}