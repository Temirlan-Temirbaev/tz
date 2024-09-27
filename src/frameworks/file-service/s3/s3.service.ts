import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { CONFIG } from 'src/config';
import { IFileService } from 'src/core/abstracts/file-service.abstract';
import { Success } from 'src/shared/types/Success.type';
import * as uuid from 'uuid';
import * as mime from 'mime-types';
import { extname, join } from 'path';
import * as fs from 'fs';
import {resolve} from "path";
@Injectable()
export class S3Service implements IFileService {
  private s3: AWS.S3;
  private tmpDir = resolve(__dirname, '../../../tmp'); // Путь до tmp директории
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: CONFIG.awsUrl,
      accessKeyId: CONFIG.awsUser,
      secretAccessKey: CONFIG.awsPassword,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  validateType(file: Express.Multer.File, types: string[], maxMBSize?: number) {
    if (!file) {
      throw new BadRequestException('File is missing');
    }

    const fileExtension = extname(file.originalname).toLowerCase();

    if (!types.includes(fileExtension)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${types.join(', ')}`);
    }

    let maxFileSize;

    if (maxMBSize) {
      maxFileSize = maxMBSize * 1024 * 1024;
    }

    if (maxMBSize && (file.size > maxFileSize)) {
      throw new BadRequestException(`File size exceeds the maximum limit of ${maxMBSize} MB`);
    }

    return;
  }

  async saveFile(file: Uint8Array, name: string): Promise<string> {
    try {
      const extension = `.${name.split('.').pop()}`;
      const key = uuid.v4() + extension;

      const buffer = Buffer.from(file);
      const contentType =
        mime.contentType(extension) || 'application/octet-stream';

      const uploadParams = {
        Bucket: CONFIG.awsBucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Key;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFile(fileName: string): Promise<Success> {
    try {
      const deleteParams = {
        Bucket: CONFIG.awsBucket,
        Key: fileName,
      };

      await this.s3.deleteObject(deleteParams).promise();
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async downloadFile(key: string) {
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir, { recursive: true });
    }

    const params = { Bucket: CONFIG.awsBucket, Key: key };
    const data = await this.s3.getObject(params).promise();
    const filePath = join(this.tmpDir, key);

    // @ts-ignore
    fs.writeFileSync(filePath, data.Body);
    return filePath
  }
}
