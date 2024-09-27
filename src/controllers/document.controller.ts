import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DocumentUseCase } from '../use-cases/document/document.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../use-cases/auth/guards/jwt.guard';
import { getUserId } from '../use-cases/auth/decorators/getUserId';
import { AdminGuard } from '../use-cases/auth/guards/admin.guard';
import { SignDocumentDto } from '../core/dto/document/sign-document.dto';


@Controller("document")
export class DocumentController {
  constructor(private documentUseCase : DocumentUseCase) {
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("document"))
  @UseGuards(JwtGuard)
  async uploadDocument(@UploadedFile() document: Express.Multer.File, @getUserId() id: string){
    return this.documentUseCase.uploadDocument(document, id);
  }

  @Post("sign")
  // @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor("p12File"))
  async signDocument(@Body() body: SignDocumentDto, @UploadedFile() signerDSK: Express.Multer.File) {
    return this.documentUseCase.signDocument(signerDSK, body);
  }
  @Get("/page/:page")
  async getDocuments(@Param("page") page: string) {
    return this.documentUseCase.getDocuments(+page)
  }

  @Get("/id/:id")
  async getDocumentById(@Param("id") id: string) {
    return this.documentUseCase.getDocumentById(+id)
  }

  @Get("/owner/:owner_id")
  async getDocumentByOwner(@Param("owner_id") owner_id: string) {
    return this.documentUseCase.getDocumentsByOwner(owner_id)
  }

  @Get("count")
  async getDocumentsCount() {
    return this.documentUseCase.getDocumentsCount();
  }

}