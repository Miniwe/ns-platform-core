import DataLoader from 'dataloader';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  Optional,
  Logger,
} from '@nestjs/common';
import {
  In,
  Repository,
  FindOptionsWhere,
  DeepPartial,
  ObjectLiteral,
  EntityManager,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOneOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ErrorContext, ErrorHandlingService } from '../error-handling';
import { TransactionContext } from '../transaction';

export interface IResourceResolver {
  resolveInternalId(uuid: string): Promise<number | null>;
}

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> implements IResourceResolver {
  protected readonly logger = new Logger(BaseService.name);
  protected abstract readonly entityName: string;
  protected loader: DataLoader<number, T | Error>;

  constructor(
    protected readonly repository: Repository<T>,
    @Optional()
    @Inject(ErrorHandlingService)
    protected readonly errorHandling?: ErrorHandlingService,
  ) {
    if (!repository)
      throw new Error(`BaseService: repository is undefined for ${this.constructor.name}`);

    this.loader = new DataLoader<number, T | Error>(async (keys: readonly number[]) => {
      const ids = Array.from(keys);
      const records = await this.repository.findBy({ id: In(ids) } as never);
      const recordsMap = new Map(records.map((record) => [record['id'] as number, record]));

      return ids.map((id) =>
        recordsMap.has(id)
          ? (recordsMap.get(id) as T)
          : new Error(`No ${this.entityName} found with id ${id}`),
      );
    });
  }

  protected getManager(): EntityManager {
    return TransactionContext.getManager() ?? this.repository.manager;
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    try {
      this.logInfo('Finding one record', { data: options });
      return await this.repository.findOne(options);
    } catch (error) {
      this.logError(error, { componentMethod: 'findOne', data: options });
      throw error;
    }
  }

  protected getLoggerContext(): string {
    return this.constructor.name;
  }

  protected getErrorContext(overrides?: Partial<ErrorContext>): ErrorContext {
    return {
      service: this.getLoggerContext(),
      entityName: this.entityName,
      ...overrides,
    };
  }

  protected logError(error: unknown, context?: ErrorContext): void {
    if (!this.errorHandling) return;
    this.errorHandling.handleError(error, this.getErrorContext(context), false);
  }

  protected logWarning(message: string, context?: ErrorContext): void {
    if (!this.errorHandling) return;
    this.errorHandling.logWarn(message, this.getErrorContext(context));
  }

  protected logInfo(message: string, context?: ErrorContext): void {
    if (!this.errorHandling) return;
    this.errorHandling.logInfo(message, this.getErrorContext(context));
  }

  async resolveInternalId(uuid: string): Promise<number | null> {
    try {
      const record = await this.repository.findOne({
        where: { uuid } as never,
        select: { id: true } as unknown as FindOptionsSelect<T>,
      });

      return (record?.['id'] as number | undefined) ?? null;
    } catch (error) {
      this.logError(error, { componentMethod: 'resolveInternalId', uuid });
      return null;
    }
  }

  async findByExternalId(uuid: string, relations?: FindOptionsRelations<T>): Promise<T> {
    const id = await this.resolveInternalId(uuid);

    if (!id) {
      this.logWarning('Record not found by UUID', {
        uuid,
        componentMethod: 'findByExternalId',
      });
      throw new NotFoundException(`${this.entityName} with UUID ${uuid} not found`);
    }

    return this.findByIdOrFail(id, { relations });
  }

  async loadById(id: number): Promise<T | Error> {
    return this.loader.load(id);
  }

  async loadManyByIds(ids: number[]): Promise<(T | Error)[]> {
    return this.loader.loadMany(ids);
  }

  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      this.logInfo('Finding many records', { data: options?.where ?? {} });
      return await this.repository.find(options);
    } catch (error) {
      this.logError(error, { componentMethod: 'findMany', data: options });
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch ${this.entityName} records: ${error.message}`,
        );
      }

      throw new BadRequestException('Unknown error');
    }
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.findMany(options);
  }

  async findOneOrFail(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.findOne(options);

    if (!entity) {
      this.logWarning('Record not found by options', {
        componentMethod: 'findOneOrFail',
        data: options,
      });
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return entity;
  }

  async exists(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<boolean> {
    try {
      return await this.repository.exists({ where });
    } catch (error) {
      this.logError(error, { componentMethod: 'exists', data: where });
      throw new BadRequestException(`Failed to check ${this.entityName} existence`);
    }
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      this.logError(error, { componentMethod: 'count', data: options });
      throw new BadRequestException(`Failed to count ${this.entityName} records`);
    }
  }

  async findWithPagination(
    page: number,
    limit: number,
    options?: FindManyOptions<T>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      this.logInfo('Finding records with pagination', { page, limit, data: options });

      const [data, total] = await this.repository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        ...options,
      });

      return { data, total, page, limit };
    } catch (error) {
      this.logError(error, {
        componentMethod: 'findWithPagination',
        page,
        limit,
        data: options,
      });
      throw new BadRequestException(`Failed to fetch paginated ${this.entityName} records`);
    }
  }

  async createMany(dataArray: DeepPartial<T>[]): Promise<T[]> {
    try {
      this.logInfo('Creating multiple records', { data: { itemsCount: dataArray.length } });
      const entities = dataArray.map((data) => this.repository.create(data));
      const result = await this.repository.save(entities);
      this.logInfo('Multiple records created successfully', {
        data: { itemsCount: result.length },
      });
      return result;
    } catch (error) {
      this.logError(error, {
        componentMethod: 'createMany',
        data: { itemsCount: dataArray.length },
      });
      throw new BadRequestException(`Failed to create ${this.entityName} records`);
    }
  }

  async updateMany(ids: number[], data: QueryDeepPartialEntity<T>): Promise<number> {
    try {
      this.logInfo('Updating multiple records', { data: { idsCount: ids.length } });
      const result = await this.repository.update(ids as never, data);
      const affectedRows = result.affected ?? 0;

      this.logInfo('Multiple records updated successfully', {
        data: { affectedRows },
      });

      ids.forEach((id) => this.loader.clear(id));
      return affectedRows;
    } catch (error) {
      this.logError(error, {
        componentMethod: 'updateMany',
        data: { idsCount: ids.length },
      });
      throw new BadRequestException(`Failed to update ${this.entityName} records`);
    }
  }

  async removeMany(ids: number[]): Promise<number> {
    try {
      this.logInfo('Deleting multiple records', { data: { idsCount: ids.length } });
      const result = await this.repository.delete(ids as never);
      const deletedCount = result.affected ?? 0;

      this.logInfo('Multiple records deleted successfully', {
        data: { deletedCount },
      });

      ids.forEach((id) => this.loader.clear(id));
      return deletedCount;
    } catch (error) {
      this.logError(error, {
        componentMethod: 'removeMany',
        data: { idsCount: ids.length },
      });
      throw new BadRequestException(`Failed to delete ${this.entityName} records`);
    }
  }

  async softDelete(id: number): Promise<void> {
    try {
      this.logInfo('Soft deleting record', { entityId: id });

      await this.findByIdOrFail(id);
      await this.repository.softDelete(id as never);
      this.loader.clear(id);

      this.logInfo('Record soft deleted successfully', { entityId: id });
    } catch (error) {
      this.logError(error, { entityId: id, componentMethod: 'softDelete' });
      throw error;
    }
  }

  async findById(id: number, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return this.getManager().findOne(this.repository.target, {
      ...options,
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async findByIdOrFail(id: number, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T> {
    const entity = await this.findById(id, options);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return entity;
  }

  async findByUuid(uuid: string, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T | null> {
    return this.getManager().findOne(this.repository.target, {
      ...options,
      where: { uuid } as unknown as FindOptionsWhere<T>,
    });
  }

  async findByUuidOrFail(uuid: string, options?: Omit<FindOneOptions<T>, 'where'>): Promise<T> {
    const entity = await this.findByUuid(uuid, options);

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with UUID ${uuid} not found`);
    }

    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      this.logInfo('Creating new record', { data });
      const entity = this.repository.create(data);
      const savedEntity = await this.repository.save(entity);

      this.logInfo('Record created successfully', {
        entityId: (savedEntity as Record<string, unknown>).id as number,
      });

      return savedEntity;
    } catch (error) {
      this.logError(error, { componentMethod: 'create', data });
      if (error instanceof Error) {
        throw new BadRequestException(`Failed to create ${this.entityName}: ${error.message}`);
      }

      throw new BadRequestException('Unknown error');
    }
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    try {
      this.logInfo('Updating record', { entityId: id, data });

      const entity = await this.findByIdOrFail(id);
      await this.repository.update((entity as Record<string, unknown>).id as never, data);

      const updatedEntity = await this.findById((entity as Record<string, unknown>).id as number);

      if (!updatedEntity) {
        throw new NotFoundException(`${this.entityName} with ID ${id} not found after update`);
      }

      this.loader.clear(id);
      this.loader.prime(id, updatedEntity);

      this.logInfo('Record updated successfully', { entityId: id });

      return updatedEntity;
    } catch (error) {
      this.logError(error, { entityId: id, componentMethod: 'update', data });

      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new BadRequestException(`Failed to update ${this.entityName}: ${error.message}`);
      }

      throw new BadRequestException('Unknown error');
    }
  }

  async delete(id: number): Promise<void> {
    const entity = await this.findByIdOrFail(id);
    await this.getManager().remove(entity);
    this.loader.clear(id);
  }
}
