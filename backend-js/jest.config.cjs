module.exports = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  // Remove the problematic generic mapper and use this instead
  moduleNameMapper: {
    // This allows you to use extensions or not, and helps with ESM
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }]
  },
  // This helps prevent the "torn down" error by giving more time
  testTimeout: 30000 
};