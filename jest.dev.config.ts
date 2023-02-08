import { Config } from "@jest/types";
import nextJest from "next/jest";

const createJestConfig: any = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
})


export default async (): Promise<Config.InitialOptions> => {
  const config: Config.InitialOptions = {
    setupFilesAfterEnv: ["./jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "cobertura", "html", "html-spa", "text", "text-summary"],
    changedSince: "origin/master",
    coverageThreshold: {
      global: {
        branches: 0,
        functions: 0,
        lines: 10,
        statements: 10
      }
    },
    verbose: true
  };
  return createJestConfig(config);
};