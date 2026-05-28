import { Module } from '@nestjs/common';

import { AdvancedCacheModule } from '@/services';

import { AdvancedThrottleGuard } from './advanced-throttle.guard';

@Module({
  imports: [AdvancedCacheModule],
  providers: [AdvancedThrottleGuard],
  exports: [AdvancedThrottleGuard],
})
export class AdvancedThrottleModule {}
