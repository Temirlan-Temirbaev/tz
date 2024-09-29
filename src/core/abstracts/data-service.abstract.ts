import { User, Notification, Document, Signature } from 'src/frameworks/data-service/postgre/model';
import { GenericRepository } from './generic-repository.abstract';

export abstract class IDataService {
  abstract users:  GenericRepository<User>
  abstract documents:  GenericRepository<Document>
  abstract notifications:  GenericRepository<Notification>
  abstract signatures:  GenericRepository<Signature>
}