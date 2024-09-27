import { Module } from '@nestjs/common';
import { S3Module } from '../../frameworks/file-service/s3/s3.module';

@Module({
  imports: [S3Module],
  exports: [S3Module]
})
export class FileServiceModule{}