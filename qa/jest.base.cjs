/** @type {import('jest').Config} */
const baseConfig = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  // forceExit: true,
  detectOpenHandles: true,
  setupFilesAfterEnv: ['./qa/jest.after-env.ts'],
  openHandlesTimeout: 1000,
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/**/index.ts',
    '!src/**/*.d.ts'
  ],
  reporters: [
    'default',
    ['jest-allure2-reporter', { resultsDir: 'allure-results' }]
  ]
};

module.exports = baseConfig;
