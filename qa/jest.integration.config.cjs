const baseConfig = require('./jest.base.cjs');

module.exports = {
  ...baseConfig,
  displayName: 'integration',
  testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage/integration',
  setupFilesAfterEnv: ['<rootDir>/test/setup/integration.setup.ts'],
  testTimeout: 60000,
  maxWorkers: 1,
};