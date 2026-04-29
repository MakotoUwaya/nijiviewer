import { fileURLToPath } from 'node:url';
import { defineAppVitestConfig } from 'vitest-config';
import { defineConfig } from 'vitest/config';

export default defineConfig(
  defineAppVitestConfig({
    appDir: fileURLToPath(new URL('.', import.meta.url)),
    coverageInclude: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
  }),
);
