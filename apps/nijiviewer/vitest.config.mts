import { fileURLToPath } from 'node:url';
import { defineAppVitestConfig } from 'vitest-config';
import { defineConfig } from 'vitest/config';

export default defineConfig(
  defineAppVitestConfig({
    appDir: fileURLToPath(new URL('.', import.meta.url)),
    coverageInclude: [
      'app/**/*.{ts,tsx}',
      'components/**/*.{ts,tsx}',
      'hooks/**/*.{ts,tsx}',
      'lib/**/*.{ts,tsx}',
    ],
    coverageThresholds: {
      lines: 62,
      statements: 62,
      functions: 58,
      branches: 48,
    },
  }),
);
