/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
    '^@apex/shared$': '<rootDir>/__mocks__/@apex/shared.ts',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics: false }],
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
module.exports = config;
