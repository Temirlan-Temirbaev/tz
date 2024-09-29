import { Module } from '@nestjs/common';
import { DataServiceModule } from '../../services/data-service/data-service.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthUseCase } from './auth.use-case';
import { JwtStrategy } from './jwt.strategy';
import { FileServiceModule } from '../../services/file-service/file-service.module';

@Module({
  imports: [DataServiceModule, FileServiceModule, JwtModule.register({}),
  ],
  providers: [
    AuthUseCase,
    JwtStrategy,
  ],
  exports: [AuthUseCase],
})
export class AuthUseCasesModule {
}