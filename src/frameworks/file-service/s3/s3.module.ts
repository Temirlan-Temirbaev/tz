import { Module } from '@nestjs/common';
import { IFileService } from 'src/core/abstracts/file-service.abstract';
import { S3Service } from './s3.service';

@Module({
  providers: [
    {
      useClass: S3Service,
      provide: IFileService,
    },
  ],
  exports: [IFileService],
})
export class S3Module {}
