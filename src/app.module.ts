import {Module} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthUseCasesModule } from './use-cases/auth/auth.use-cases.module';
import { DocumentController } from './controllers/document.controller';
import { DocumentUseCasesModule } from './use-cases/document/document.use-cases.module';
import { NotificationUseCasesModule } from './use-cases/notification/notification.use-cases.module';
import { NotificationController } from './controllers/notification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath : ".env"}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AuthUseCasesModule,
    DocumentUseCasesModule,
    NotificationUseCasesModule
  ],
  controllers: [
    AuthController,
    DocumentController,
    NotificationController
  ]
})
export class AppModule {
}
