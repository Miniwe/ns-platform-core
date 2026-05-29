const baseConfig = require('./jest.base.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  displayName: 'contracts',
  testMatch: ['**/*.spec.ts'],
  coverageDirectory: '<rootDir>/coverage/contracts'
};

module.exports = config;
