import { Module } from '@nestjs/common';
import { PostgreDataModule } from 'src/frameworks/data-service/postgre/postgre-data.module';

@Module({
  imports: [PostgreDataModule],
  exports: [PostgreDataModule],
})
export class DataServiceModule {
}
