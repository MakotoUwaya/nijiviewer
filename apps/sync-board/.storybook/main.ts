import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);

const getAbsolutePath = (value: string) => {
  return dirname(require.resolve(join(value, 'package.json')));
};

const config: StorybookConfig = {
  stories: ['../(app|components|lib)/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-vitest')],
  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {},
  },
};

export default config;
