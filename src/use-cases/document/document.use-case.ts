import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IFileService } from '../../core/abstracts/file-service.abstract';
import { IDataService } from '../../core/abstracts/data-service.abstract';
import { getP12Data } from '../../shared/utils/getP12Data';
import { SignDocumentDto } from '../../core/dto/document/sign-document.dto';
import { md, util } from 'node-forge';
import * as fs from 'node:fs';
import { Success } from '../../shared/types/Success.type';
import { NotificationUseCase } from '../notification/notification.use-case';
import { ICacheService } from '../../core/abstracts/cache-service.abstract';

@Injectable()
export class DocumentUseCase {

  constructor(private fileService: IFileService,
              private dataService: IDataService,
              private notificationUseCase: NotificationUseCase,
              private cacheService: ICacheService
  ) {
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
    await this.cacheService.delete(`documents/owner/${owner.user_id}`)
    return await this.dataService.documents.save(document);
  }

  async getDocuments(page = 1) {
    const cachedDocuments = await this.cacheService.get(`documents/page/${page}`)
    if (cachedDocuments) return cachedDocuments
    const documents = await this.dataService.documents.find(
      {
        order: { created_at: 'DESC' },
        skip: (page - 1) * 10,
        take: 10,
      },
    );
    await this.cacheService.set(`documents/page/${page}`, documents, 60);
    return documents;
  }

  async getDocumentsByOwner(owner_id: string) {
    const cachedDocuments = await this.cacheService.get(`documents/owner/${owner_id}`);
    if (cachedDocuments) return cachedDocuments;
    const documents = await this.dataService.documents.findBy({ owner: { user_id: owner_id } });

    if (!documents) {
      throw new NotFoundException('Documents not found');
    }
    await this.cacheService.set(`documents/owner/${owner_id}`, documents, 60);
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
    const pages = Math.ceil(count / 10);
    return { pages: pages > 0 ? pages : 1 };
  }

  // DSK - digital signature key
  async signDocument(signerDSK: Express.Multer.File, { password, document_id }: SignDocumentDto) : Promise<Success> {
    this.fileService.validateType(signerDSK, ['.p12']);
    const { privateKey, subject } = await getP12Data(signerDSK, password);
    const { value: signerId } = subject.attributes
      .find(attribute => attribute.name === 'serialNumber');
    const signer = await this.dataService.users.findOne({
      where: { user_id: String(signerId) },
      relations: ['signatures', "notifications"],
    });
    if (!signer) {
      throw new UnauthorizedException('Signature is invalid');
    }

    const document = await this.dataService.documents.findOne({
      where: { document_id },
      relations: ['signature', 'notification', 'owner'],
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (document.status !== "pending") {
      throw new BadRequestException("This document is already passed moderation")
    }

    const documentPath = await this.fileService.downloadFile(document.document_url);
    const signatureString = await this.signFile(documentPath, privateKey);
    fs.unlinkSync(documentPath);

    const signature = this.dataService.signatures.create({ user: signer, document, signature: signatureString });
    await this.dataService.signatures.save(signature);

    document.signature = signature;
    document.accepter = signer;
    document.status = "accepted";
    document.accepted_at = new Date();

    const notification = await this.notificationUseCase.notificate(document.owner, document);

    document.notification = notification;

    signer.signatures = [...signer.signatures, signature];
    signer.notifications = [...signer.notifications, notification];
    await this.cacheService.delete(`documents/owner/${document.owner.user_id}`)

    await this.dataService.users.save(signer);

    await this.dataService.documents.save(document);

    return { success: true }
  }

  async denieDocument(user_id : string, document_id: number) : Promise<Success> {
    const user = await this.dataService.users.findOne({where : {user_id}, relations : ["notifications"]})
    const document = await this.dataService.documents.findOne({where: {document_id}, relations : ["notification", "owner"]})
    if (document.status !== "pending") {
      throw new BadRequestException("This document is already passed moderation")
    }
    document.status = "denied"
    const notification = await this.notificationUseCase.notificate(document.owner, document);
    document.notification = notification
    user.notifications = [...user.notifications, notification]
    await this.dataService.users.save(user);
    await this.dataService.documents.save(document);
    await this.cacheService.delete(`documents/owner/${document.owner.user_id}`)
    return {success : true}
  }

  private async signFile(filePath: string, privateKey) {
    const fileBuffer = fs.readFileSync(filePath);
    const mdHash = md.sha256.create();
    mdHash.update(fileBuffer.toString('binary'));
    const signature = privateKey.sign(mdHash);
    const signatureBase64 = util.encode64(signature);

    return signatureBase64;
  }
}