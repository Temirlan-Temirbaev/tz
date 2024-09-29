import { Repository } from 'typeorm';

export abstract class GenericRepository<T> extends Repository<T> {}