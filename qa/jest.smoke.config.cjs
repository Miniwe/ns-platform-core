import type { Config } from 'jest';
import baseConfig from './jest.base.cjs';

const config: Config = {
  ...baseConfig,
  displayName: 'smoke',
  testMatch: ['<rootDir>/test/smoke/**/*.spec.ts'],
  testTimeout: 120000,
  maxWorkers: 1
};

export default config;