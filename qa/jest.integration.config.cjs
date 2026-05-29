const baseConfig = require('./jest.base.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  displayName: 'integration',
  testMatch: ['<rootDir>/test/integration/**/*.int-spec.ts'],
  coverageDirectory: '<rootDir>/coverage/integration',
  setupFilesAfterEnv: ['<rootDir>/test/setup/integration.setup.ts'],
  testTimeout: 60000,
  maxWorkers: 1,
};

module.exports = config;