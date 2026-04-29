import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(dirname, './'),
    },
  },
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': resolve(dirname, './'),
          },
        },
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./test/setup.ts'],
          include: ['**/*.{test,spec}.{ts,tsx}'],
          exclude: ['**/node_modules/**', '**/dist/**', '.next/**'],
        },
      },
      {
        plugins: [storybookTest({ configDir: resolve(dirname, '.storybook') })],
        resolve: {
          alias: {
            '@': resolve(dirname, './'),
          },
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      extension: ['.ts', '.tsx'],
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.{stories,test,spec}.{ts,tsx}',
        '**/*.d.ts',
        '**/types/**',
        '**/.storybook/**',
        '**/test/**',
        '**/.next/**',
        '**/coverage/**',
        '**/*.config.{ts,mts,js,mjs,cjs}',
      ],
    },
  },
});
