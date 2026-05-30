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
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ErrorContext, ErrorHandlingService } from '../error-handling';
import { TransactionContext } from '../transaction';

/**
 * Контракт для сервисов, поддерживающих конвертацию внешнего UUID во внутренний ID
 */
export interface IResourceResolver {
  resolveInternalId(uuid: string): Promise<number | null>;
}

export interface BaseServiceOptions {
  softDelete?: boolean;
  audit?: boolean;
}

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> implements IResourceResolver {
  protected readonly logger = new Logger(BaseService.name);
  protected abstract readonly repository: Repository<T>;
  protected abstract readonly entityName: string;
  protected loader: DataLoader<number, T>;

  constructor(
    @Optional()
    @Inject(ErrorHandlingService)
    protected readonly errorHandling?: ErrorHandlingService,
  ) {
    this.loader = new DataLoader<number, T>(async (keys: readonly number[]) => {
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

  /**
   * Возвращает EntityManager из текущего транзакционного контекста
   * или стандартный manager репозитория.
   */
  protected getManager(): EntityManager {
    return TransactionContext.getManager() ?? this.repository.manager;
  }

  /**
   * КРИТИЧЕСКИЙ МЕТОД: Преобразование UUID во внутренний числовой ID для guards.
   */
  async resolveInternalId(uuid: string): Promise<number | null> {
    try {
      const record = await this.repository.findOne({
        where: { uuid } as never,
        select: ['id'] as string[],
      });

      return record?.id ?? null;
    } catch (error) {
      this.logError(error, { componentMethod: 'resolveInternalId', uuid });
      return null;
    }
  }

  /**
   * Поиск сущности по внешнему UUID.
   */
  async findByExternalId(uuid: string, relations?: string[]): Promise<T> {
    const id = await this.resolveInternalId(uuid);

    if (!id) {
      const error = new NotFoundException(`${this.entityName} with UUID ${uuid} not found`);
      this.logWarning('Record not found by UUID', {
        uuid,
        componentMethod: 'findByExternalId',
      });
      throw error;
    }

    return this.findOne(id, relations);
  }

  async loadById(id: number): Promise<T | Error> {
    return this.loader.load(id);
  }

  async loadManyByIds(ids: number[]): Promise<Array<T | Error>> {
    return this.loader.loadMany(ids);
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

    const errorContext = this.getErrorContext(context);
    this.errorHandling.handleError(error, errorContext, false);
  }

  protected logWarning(message: string, context?: ErrorContext): void {
    if (!this.errorHandling) return;

    const errorContext = this.getErrorContext(context);
    this.errorHandling.logWarn(message, errorContext);
  }

  protected logInfo(message: string, context?: ErrorContext): void {
    if (!this.errorHandling) return;

    const errorContext = this.getErrorContext(context);
    this.errorHandling.logInfo(message, errorContext);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      this.logInfo('Finding all records', { data: options?.where ?? {} });
      return await this.repository.find(options);
    } catch (error) {
      this.logError(error, { componentMethod: 'findAll' });

      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to fetch ${this.entityName} records: ${error.message}`,
        );
      }

      throw new BadRequestException('Unknown error');
    }
  }

  async findOne(id: number, relations?: string[]): Promise<T> {
    try {
      this.logInfo('Finding record by ID', { entityId: id, data: { relations } });

      const entity = await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        relations,
      });

      if (!entity) {
        const notFoundError = new NotFoundException(`${this.entityName} with ID ${id} not found`);
        this.logWarning('Record not found', {
          entityId: id,
          componentMethod: 'findOne',
        });
        throw notFoundError;
      }

      return entity;
    } catch (error) {
      this.logError(error, { entityId: id, componentMethod: 'findOne' });
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logInfo('Deleting record', { entityId: id });

      const entity = await this.findOne(id);
      await this.repository.remove(entity);
      this.loader.clear(id);

      this.logInfo('Record deleted successfully', { entityId: id });
    } catch (error) {
      this.logError(error, { entityId: id, componentMethod: 'remove' });
      throw error;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      return await this.repository.exists({
        where: { id } as unknown as FindOptionsWhere<T>,
      });
    } catch (error) {
      this.logError(error, { entityId: id, componentMethod: 'exists' });
      throw new BadRequestException(`Failed to check ${this.entityName} existence`);
    }
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      this.logError(error, { componentMethod: 'count' });
      throw new BadRequestException(`Failed to count ${this.entityName} records`);
    }
  }

  async findWithPagination(
    page: number,
    limit: number,
    options?: FindManyOptions<T>,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    try {
      this.logInfo('Finding records with pagination', { page, limit });

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

      const result = await this.repository.update(ids, data);
      const affectedRows = result.affected ?? 0;

      this.logInfo('Multiple records updated successfully', {
        data: { affectedRows },
      });

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

      const result = await this.repository.delete(ids);
      const deletedCount = result.affected ?? 0;

      this.logInfo('Multiple records deleted successfully', {
        data: { deletedCount },
      });

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

      await this.findOne(id);
      await this.repository.softDelete(id as never);
      this.loader.clear(id);

      this.logInfo('Record soft deleted successfully', { entityId: id });
    } catch (error) {
      this.logError(error, { entityId: id, componentMethod: 'softDelete' });
      throw error;
    }
  }

  /**
   * Поиск сущности по числовому ID.
   */
  async findById(id: number): Promise<T | null> {
    return this.getManager().findOne(this.repository.target, {
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  /**
   * Поиск сущности по ID с выбросом исключения, если не найдена.
   */
  async findByIdOrFail(id: number): Promise<T> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }

  /**
   * Поиск сущности по UUID.
   */
  async findByUuid(uuid: string): Promise<T | null> {
    return this.getManager().findOne(this.repository.target, {
      where: { uuid } as unknown as FindOptionsWhere<T>,
    });
  }

  /**
   * Поиск сущности по UUID с гарантированным результатом.
   */
  async findByUuidOrFail(uuid: string): Promise<T> {
    const entity = await this.findByUuid(uuid);

    if (!entity) {
      throw new NotFoundException(`Entity with UUID ${uuid} not found`);
    }

    return entity;
  }

  /**
   * Создание новой сущности.
   */
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

  /**
   * Обновление существующей сущности.
   */
  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    try {
      this.logInfo('Updating record', { entityId: id, data });

      await this.findOne(id);
      await this.repository.update(id, data);
      this.loader.clear(id);

      const updatedEntity = await this.findOne(id);
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

  /**
   * Удаление сущности через manager.
   */
  async delete(id: number): Promise<void> {
    const entity = await this.findByIdOrFail(id);
    await this.getManager().remove(entity);
  }
}
