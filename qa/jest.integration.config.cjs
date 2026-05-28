import type { Config } from 'jest';
import baseConfig from './jest.base.cjs';

const config: Config = {
  ...baseConfig,
  displayName: 'integration',
  testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage/integration',
  setupFilesAfterEnv: ['<rootDir>/test/setup/integration.setup.ts'],
  testTimeout: 60000,
  maxWorkers: 1
};

export default config;