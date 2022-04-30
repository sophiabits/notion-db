/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  roots: ['<rootDir>/src'],
  setupFiles: ['./config/jest.setup.js'],
  testRegex: '__tests__/.*\\.test\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/'],
};

module.exports = config;
