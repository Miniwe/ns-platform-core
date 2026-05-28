import type { Config } from 'jest';
import baseConfig from './jest.base.cjs';

const config: Config = {
  ...baseConfig,
  displayName: 'contracts',
  testMatch: ['<rootDir>/test/contracts/**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage/contracts'
};

export default config;