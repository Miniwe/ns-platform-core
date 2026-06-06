import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { EntityManager, Repository } from 'typeorm';
import { BaseService } from '.';
import { TransactionContext } from '../transaction';

jest.mock('dataloader');

type TestEntity = {
  id: number;
  uuid: string;
  name: string;
};

class TestBaseService extends BaseService<TestEntity> {
  protected readonly entityName = 'TestEntity';

  constructor(
    protected readonly repository: Repository<TestEntity>,
    errorHandling?: any,
  ) {
    super(errorHandling);
  }

  public exposeGetManager() {
    return this.getManager();
  }

  public exposeGetErrorContext(overrides?: any) {
    return this.getErrorContext(overrides);
  }
}

describe('BaseService', () => {
  let repository: jest.Mocked<Repository<TestEntity>>;
  let manager: jest.Mocked<EntityManager>;
  let errorHandling: {
    handleError: jest.Mock;
    logWarn: jest.Mock;
    logInfo: jest.Mock;
  };
  let service: TestBaseService;

  const entity: TestEntity = {
    id: 1,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Alpha',
  };

  beforeEach(() => {
    manager = {
      findOne: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    repository = {
      manager,
      target: 'TestEntity',
      find: jest.fn(),
      findBy: jest.fn(),
      findOne: jest.fn(),
      exists: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<Repository<TestEntity>>;

    errorHandling = {
      handleError: jest.fn(),
      logWarn: jest.fn(),
      logInfo: jest.fn(),
    };

    service = new TestBaseService(repository, errorHandling);

    jest.spyOn(TransactionContext, 'getManager').mockReturnValue(manager as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('manager resolution', () => {
    it('uses transaction manager when available', () => {
      expect(service.exposeGetManager()).toBe(manager);
    });

    it('falls back to repository.manager when transaction manager is missing', () => {
      jest.spyOn(TransactionContext, 'getManager').mockReturnValue(undefined as any);
      expect(service.exposeGetManager()).toBe(repository.manager);
    });
  });

  describe('resolveInternalId', () => {
    it('returns internal id when uuid exists', async () => {
      repository.findOne.mockResolvedValue({ id: 7 } as TestEntity);

      await expect(service.resolveInternalId(entity.uuid)).resolves.toBe(7);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { uuid: entity.uuid },
        select: { id: true },
      });
    });

    it('returns null when uuid is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.resolveInternalId(entity.uuid)).resolves.toBeNull();
    });

    it('logs error and returns null when repository throws', async () => {
      const error = new Error('db fail');
      repository.findOne.mockRejectedValue(error);

      await expect(service.resolveInternalId(entity.uuid)).resolves.toBeNull();
      expect(errorHandling.handleError).toHaveBeenCalled();
    });
  });

  describe('findByExternalId', () => {
    it('returns entity resolved from uuid', async () => {
      jest.spyOn(service, 'resolveInternalId').mockResolvedValue(1);
      jest.spyOn(service, 'findOne').mockResolvedValue(entity);

      await expect(service.findByExternalId(entity.uuid)).resolves.toEqual(entity);
    });

    it('throws NotFoundException when uuid is missing', async () => {
      jest.spyOn(service, 'resolveInternalId').mockResolvedValue(null);

      await expect(service.findByExternalId(entity.uuid)).rejects.toThrow(NotFoundException);
      expect(errorHandling.logWarn).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns entity by id', async () => {
      repository.findOne.mockResolvedValue(entity);

      await expect(service.findOne(1)).resolves.toEqual(entity);
    });

    it('throws NotFoundException when entity does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns all records', async () => {
      repository.find.mockResolvedValue([entity]);

      await expect(
        service.findAll({ where: { name: 'Alpha' } as any }),
      ).resolves.toEqual([entity]);
    });

    it('wraps repository errors into BadRequestException', async () => {
      repository.find.mockRejectedValue(new Error('find failed'));

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('creates and saves entity', async () => {
      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      await expect(service.create({ name: 'Alpha' })).resolves.toEqual(entity);
      expect(repository.create).toHaveBeenCalledWith({ name: 'Alpha' });
      expect(repository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('update', () => {
    it('updates entity, clears loader and reloads fresh state', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(entity)
        .mockResolvedValueOnce({ ...entity, name: 'Updated' });

      repository.update.mockResolvedValue({ affected: 1 } as any);

      const clearSpy = jest.spyOn((service as any).loader, 'clear');
      const primeSpy = jest.spyOn((service as any).loader, 'prime');

      await expect(service.update(1, { name: 'Updated' } as any)).resolves.toEqual({
        ...entity,
        name: 'Updated',
      });

      expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
      expect(clearSpy).toHaveBeenCalledWith(1);
      expect(primeSpy).toHaveBeenCalledWith(1, { ...entity, name: 'Updated' });
    });

    it('rethrows NotFoundException from precheck', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('missing'));

      await expect(service.update(1, { name: 'Updated' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('removes entity through manager', async () => {
      jest.spyOn(service, 'findByIdOrFail').mockResolvedValue(entity);
      manager.remove.mockResolvedValue(entity as any);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(manager.remove).toHaveBeenCalledWith(entity);
    });
  });

  describe('remove and softDelete', () => {
    it('remove deletes entity through repository.remove and clears loader', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(entity);
      repository.remove.mockResolvedValue(entity as any);

      const clearSpy = jest.spyOn((service as any).loader, 'clear');

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.remove).toHaveBeenCalledWith(entity);
      expect(clearSpy).toHaveBeenCalledWith(1);
    });

    it('softDelete deletes by id and clears loader', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(entity);
      repository.softDelete.mockResolvedValue({ affected: 1 } as any);

      const clearSpy = jest.spyOn((service as any).loader, 'clear');

      await expect(service.softDelete(1)).resolves.toBeUndefined();
      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(clearSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('exists and count', () => {
    it('returns existence flag', async () => {
      repository.exists.mockResolvedValue(true);

      await expect(service.exists(1)).resolves.toBe(true);
    });

    it('returns total count', async () => {
      repository.count.mockResolvedValue(12);

      await expect(service.count()).resolves.toBe(12);
    });
  });

  describe('pagination', () => {
    it('returns paginated result with skip/take', async () => {
      repository.findAndCount.mockResolvedValue([[entity], 1]);

      await expect(service.findWithPagination(2, 10)).resolves.toEqual({
        data: [entity],
        total: 1,
        page: 2,
        limit: 10,
      });

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe('bulk operations', () => {
    it('createMany creates and saves multiple entities', async () => {
      repository.create
        .mockReturnValueOnce(entity)
        .mockReturnValueOnce({ ...entity, id: 2, uuid: 'a', name: 'Beta' });
      repository.save.mockResolvedValue([
        entity,
        { ...entity, id: 2, uuid: 'a', name: 'Beta' },
      ] as any);

      await expect(
        service.createMany([{ name: 'Alpha' }, { name: 'Beta' }] as any),
      ).resolves.toHaveLength(2);
    });

    it('updateMany returns affected rows', async () => {
      repository.update.mockResolvedValue({ affected: 2 } as any);

      await expect(service.updateMany([1, 2], { name: 'Updated' } as any)).resolves.toBe(2);
    });

    it('removeMany returns deleted count', async () => {
      repository.delete.mockResolvedValue({ affected: 2 } as any);

      await expect(service.removeMany([1, 2])).resolves.toBe(2);
    });
  });

  describe('manager-backed find methods', () => {
    it('findById uses manager.findOne', async () => {
      manager.findOne.mockResolvedValue(entity as any);

      await expect(service.findById(1)).resolves.toEqual(entity);
      expect(manager.findOne).toHaveBeenCalledWith(repository.target, {
        where: { id: 1 },
      });
    });

    it('findByIdOrFail throws when entity not found', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(service.findByIdOrFail(1)).rejects.toThrow(NotFoundException);
    });

    it('findByUuid uses manager.findOne', async () => {
      manager.findOne.mockResolvedValue(entity as any);

      await expect(service.findByUuid(entity.uuid)).resolves.toEqual(entity);
      expect(manager.findOne).toHaveBeenCalledWith(repository.target, {
        where: { uuid: entity.uuid },
      });
    });

    it('findByUuidOrFail throws when entity not found', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(service.findByUuidOrFail(entity.uuid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('loader integration', () => {
    it('loadById resolves entity through dataloader batch', async () => {
      repository.findBy.mockResolvedValue([entity]);

      await expect(service.loadById(1)).resolves.toEqual(entity);
    });

    it('loadManyByIds returns ordered results', async () => {
      repository.findBy.mockResolvedValue([entity]);

      const result = await service.loadManyByIds([1]);
      expect(result).toEqual([entity]);
    });
  });
});