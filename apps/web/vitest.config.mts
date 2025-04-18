import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  test: {
    coverage: {
      extension: ['.ts', '.tsx'],
      include: ['components/**', 'app/**'],
      exclude: ['**/*.?(stories|test|spec).ts?(x)', 'test/e2e/**'],
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'test/e2e/**'],
  },
});
