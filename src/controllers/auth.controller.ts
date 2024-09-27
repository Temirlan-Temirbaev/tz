import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUseCase } from '../use-cases/auth/auth.use-case';
import { JwtGuard } from '../use-cases/auth/guards/jwt.guard';
import { getUserId } from '../use-cases/auth/decorators/getUserId';

@Controller('auth')
export class AuthController {

  constructor(private authUseCase: AuthUseCase) {
  }

  @Post('login')
  @UseInterceptors(FileInterceptor('p12File'))
  async login(@UploadedFile() file: Express.Multer.File, @Body() body: {password: string}) {
    if (!file) {
      return { message: 'No file provided' };
    }
    return this.authUseCase.auth(file, body.password)
  }

  @Get("check-login")
  @UseGuards(JwtGuard)
  async checkLogin(@getUserId() id) {
    return this.authUseCase.checkLogin(id);
  }
}
