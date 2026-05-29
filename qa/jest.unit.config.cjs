const baseConfig = require('./jest.base.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  displayName: 'unit',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: '<rootDir>/coverage/unit',
  coverageThreshold: {
    global: {
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85,
    },
  },
};

module.exports = config;
