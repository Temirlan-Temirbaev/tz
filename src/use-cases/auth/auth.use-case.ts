import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { IDataService } from 'src/core/abstracts/data-service.abstract';
import { JwtService } from '@nestjs/jwt';
import { getP12Data } from '../../shared/utils/getP12Data';
import { CONFIG } from '../../config';
import { IFileService } from '../../core/abstracts/file-service.abstract';

@Injectable()
export class AuthUseCase {
  constructor(private dataService: IDataService, private fileService: IFileService, private jwtService: JwtService) {

  }

  private async generateToken(user_id: string, role: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: user_id,
        role
      },
      {
        secret: CONFIG.jwtSecret
        , expiresIn: '1h',
      },
    );
  }

  async auth(file: Express.Multer.File, password: string) {
    this.fileService.validateType(file, [".p12"]);
    const { subject } = await getP12Data(file, password);
    const { value: id } = subject.attributes.find(attribute => attribute.name === 'serialNumber');
    const { value: name } = subject.attributes.find(attribute => attribute.shortName === 'CN');
    if (!id || !name) {
      throw new BadRequestException('Bad digital signature file!');
    }
    const candidate = await this.dataService.users.findOneBy({ user_id: String(id) });
    if (candidate) {
      const token = await this.generateToken(String(id), candidate.role)
      return { token }
    }
    const user = this.dataService.users.create({ user_id: String(id), name: String(name) });
    await this.dataService.users.save(user);
    const token = await this.generateToken(String(id), user.role)
    return { token };
  }

  async checkLogin(user_id: string) {
    const user = await this.dataService.users.findOneBy({user_id});
    if (!user) {
      throw new UnauthorizedException("User not found")
    }
    return user;
  }
}