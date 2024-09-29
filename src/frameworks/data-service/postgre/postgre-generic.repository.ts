import { EntityManager, EntityTarget, QueryRunner } from 'typeorm';
import { GenericRepository } from 'src/core/abstracts/generic-repository.abstract';

export class PostgreGenericRepository<T> extends GenericRepository<T> {
  constructor(
    target: EntityTarget<T>,
    manager: EntityManager,
    queryRunner: QueryRunner,
  ) {
    super(target, manager, queryRunner);
  }
}