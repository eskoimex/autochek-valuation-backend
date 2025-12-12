module.exports = {
  moduleFileExtensions: ["js", "ts"],
  rootDir: ".",
  testRegex: ".e2e-spec.ts$",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleDirectories: ["node_modules", "src"],
};
