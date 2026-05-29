const baseConfig = require('./jest.base.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  displayName: 'smoke',
  testMatch: ['<rootDir>/test/smoke/**/*.smoke-spec.ts'],
  coverageDirectory: '<rootDir>/coverage/smoke',
  testTimeout: 120000,
  maxWorkers: 1,
};

module.exports = config;