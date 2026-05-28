import { Module } from '@nestjs/common';

import { AdvancedCacheModule } from '@/shared/services/advanced-cache/advanced-cache.module';

import { AdvancedThrottleGuard } from './advanced-throttle.guard';

@Module({
  imports: [AdvancedCacheModule],
  providers: [AdvancedThrottleGuard],
  exports: [AdvancedThrottleGuard],
})
export class AdvancedThrottleModule {}
