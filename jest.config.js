/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  verbose: true,
  maxWorkers: 1, // in-memory DB shared across tests — no parallel execution
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
};

module.exports = config;
