import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataService } from 'src/core/abstracts/data-service.abstract';
import { User, Notification, Document, Signature } from 'src/frameworks/data-service/postgre/model';
import { PostgreGenericRepository } from './postgre-generic.repository';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GenericRepository } from '../../../core/abstracts/generic-repository.abstract';

@Injectable()
export class PostgreDataService
  implements IDataService, OnApplicationBootstrap
{
  users: PostgreGenericRepository<User>;
  documents: PostgreGenericRepository<Document>;
  notifications: PostgreGenericRepository<Notification>;
  signatures : PostgreGenericRepository<Signature>

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(User) private userRepository: GenericRepository<User>,
    @InjectRepository(Document) private documentRepository: GenericRepository<Document>,
    @InjectRepository(Notification) private notificationRepository: GenericRepository<Notification>,
    @InjectRepository(Signature) private signatureRepository: GenericRepository<Signature>
  ) {}

  onApplicationBootstrap() {
    this.users = new PostgreGenericRepository<User>(User, this.entityManager, this.userRepository.queryRunner);
    this.documents = new PostgreGenericRepository<Document>(Document, this.entityManager, this.documentRepository.queryRunner);
    this.notifications = new PostgreGenericRepository<Notification>(Notification, this.entityManager, this.notificationRepository.queryRunner);
    this.signatures = new PostgreGenericRepository<Signature>(Signature, this.entityManager, this.signatureRepository.queryRunner)
  }
}
