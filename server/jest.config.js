module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
};
