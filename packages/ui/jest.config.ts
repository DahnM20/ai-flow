import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.ts", "**/?(*.)+(spec|test).ts"],
};

export default config;
