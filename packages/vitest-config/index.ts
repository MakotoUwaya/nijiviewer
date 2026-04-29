import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vitest/config';

interface AppVitestConfigOptions {
  /** アプリのルート絶対パス。`fileURLToPath(new URL('.', import.meta.url))` を渡す。 */
  appDir: string;
  /** カバレッジ計測対象のディレクトリ glob（例: `app/**\/*.{ts,tsx}`）。 */
  coverageInclude: string[];
}

const COVERAGE_EXCLUDE = [
  '**/*.{stories,test,spec}.{ts,tsx}',
  '**/*.d.ts',
  '**/types/**',
  '**/.storybook/**',
  '**/test/**',
  '**/.next/**',
  '**/coverage/**',
  '**/*.config.{ts,mts,js,mjs,cjs}',
];

export function defineAppVitestConfig({
  appDir,
  coverageInclude,
}: AppVitestConfigOptions): UserConfig {
  const alias = { '@': appDir };

  return {
    resolve: { alias },
    test: {
      projects: [
        {
          plugins: [react()],
          resolve: { alias },
          test: {
            name: 'unit',
            environment: 'jsdom',
            setupFiles: [resolve(appDir, 'test/setup.ts')],
            include: ['**/*.{test,spec}.{ts,tsx}'],
            exclude: [
              '**/node_modules/**',
              '**/dist/**',
              'test/e2e/**',
              '.next/**',
            ],
          },
        },
        {
          plugins: [storybookTest({ configDir: resolve(appDir, '.storybook') })],
          resolve: { alias },
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
        reportsDirectory: resolve(appDir, 'coverage'),
        include: coverageInclude,
        exclude: COVERAGE_EXCLUDE,
      },
    },
  };
}
