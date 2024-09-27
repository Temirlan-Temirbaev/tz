import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IFileService } from '../../core/abstracts/file-service.abstract';
import { IDataService } from '../../core/abstracts/data-service.abstract';
import { getP12Data } from '../../shared/utils/getP12Data';
import { SignDocumentDto } from '../../core/dto/document/sign-document.dto';
import { md, util } from 'node-forge';
import * as fs from 'node:fs';
import { extname } from 'path';

@Injectable()
export class DocumentUseCase {

  constructor(private fileService: IFileService, private dataService: IDataService) {
  }

  async uploadDocument(documentFile: Express.Multer.File, user_id: string) {
    this.fileService.validateType(documentFile, ['.docx', '.png', '.jpg', '.pdf'], 10);
    const document_url = await this.fileService.saveFile(documentFile.buffer, documentFile.originalname);
    const document_name = documentFile.originalname;
    const owner = await this.dataService.users.findOneBy({ user_id });
    if (!owner) {
      throw new UnauthorizedException('User not found');
    }
    const document = this.dataService.documents.create(
      {
        document_url,
        document_name,
        status: 'pending',
        owner,
      },
    );
    return await this.dataService.documents.save(document);
  }

  async getDocuments(page = 1) {
    const documents = await this.dataService.documents.find(
      {
        order: { created_at: 'DESC' },
        skip: (page - 1) * 10,
        take: 10,
      },
    );
    return documents;
  }

  async getDocumentsByOwner(owner_id: string) {
    const documents = await this.dataService.documents.findBy({ owner: { user_id: owner_id } });

    if (!documents) {
      throw new NotFoundException('Documents not found');
    }
    return documents;
  }

  async getDocumentById(id: number) {
    const document = await this.dataService.documents.findOneBy({ document_id: id });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async getDocumentsCount() {
    const count = await this.dataService.documents.count();
    return { pages: count < 10 ? 1 : count / 10 };
  }

  // DSK - digital signature key
  async signDocument(signerDSK: Express.Multer.File, { password, document_id }: SignDocumentDto) {
    this.fileService.validateType(signerDSK, ['.p12']);
    const { privateKey, subject } = await getP12Data(signerDSK, password);
    const { value: signerId } = subject.attributes
      .find(attribute => attribute.name === 'serialNumber');
    const signer = await this.dataService.users.findOne({where: { user_id: String(signerId)}, relations : ["signatures"]});
    if (!signer) {
      throw new UnauthorizedException("Signature is invalid");
    }

    const document = await this.dataService.documents.findOne({where: {document_id}, relations: ["signature", "notification"]})
    console.log(document);
    const documentPath = await this.fileService.downloadFile(document.document_url)
    if ([".png", ".jpg"].includes(extname(documentPath))) {
      const signatureString = await this.signImage(documentPath, privateKey);
      fs.unlinkSync(documentPath);
      const signature = this.dataService.signatures.create({user: signer, document, signature: signatureString})
      await this.dataService.signatures.save(signature)
      signer.signatures = [...signer.signatures, signature]
      await this.dataService.users.save(signer);
      document.signature = signature;
    }


    return await this.dataService.documents.save(document);
  }

  private async signImage(filePath: string, privateKey) {
    const fileBuffer = fs.readFileSync(filePath);
    const mdHash = md.sha256.create();
    mdHash.update(fileBuffer.toString('binary'));
    const signature = privateKey.sign(mdHash);
    const signatureBase64 = util.encode64(signature);

    return signatureBase64;
  }
}