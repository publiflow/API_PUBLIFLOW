import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', 
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ["./"],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], 
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export = config;
