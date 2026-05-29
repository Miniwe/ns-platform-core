import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AdvancedThrottleModule } from './advanced-throttle.module';
import { AdvancedThrottleGuard } from './advanced-throttle.guard';
import { AdvancedCacheService } from '@/services';

const cacheServiceMock = {
  incr: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn(),
};

@Module({
  providers: [
    {
      provide: AdvancedCacheService,
      useValue: cacheServiceMock,
    },
  ],
  exports: [AdvancedCacheService],
})
class TestAdvancedCacheModule {}

describe('AdvancedThrottleModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('register() — должен компилироваться с imported Cache module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AdvancedThrottleModule.register({
          imports: [TestAdvancedCacheModule],
        }),
      ],
    }).compile();

    expect(moduleRef.get(AdvancedThrottleGuard)).toBeInstanceOf(AdvancedThrottleGuard);
  });

  it('registerAsync() — должен компилироваться с imported Cache module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AdvancedThrottleModule.registerAsync({
          imports: [TestAdvancedCacheModule],
          useFactory: () => ({}),
        }),
      ],
    }).compile();

    expect(moduleRef.get(AdvancedThrottleGuard)).toBeInstanceOf(AdvancedThrottleGuard);
  });

  it('должен падать без imported Cache module', async () => {
    await expect(
      Test.createTestingModule({
        imports: [AdvancedThrottleModule.register({})],
      }).compile(),
    ).rejects.toThrow(/AdvancedCacheService/);
  });
});