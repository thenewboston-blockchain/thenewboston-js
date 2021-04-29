module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // The test environment that will be used for testing
  testEnvironment: "node",

  transformIgnorePatterns: ["node_modules/nock/"],
};
