import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDataService } from 'src/core/abstracts/data-service.abstract';
import { PostgreDataService } from './postgre-data.service';
import { CONFIG } from 'src/config';
import { User, Document, Notification, Signature } from 'src/frameworks/data-service/postgre/model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Document, Notification, Signature]),
    TypeOrmModule.forRoot({
      entities: [User, Document, Notification, Signature],
      type: 'postgres',
      synchronize: true,
      url: CONFIG.postgresURL,
    }),
  ],
  providers: [
    {
      provide: IDataService,
      useClass: PostgreDataService,
    },
  ],
  exports: [IDataService],
})
export class PostgreDataModule {}
