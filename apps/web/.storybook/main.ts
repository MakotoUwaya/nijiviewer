import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs';
import dotenv from 'dotenv';

// ESM環境で__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ESM環境でrequire.resolveを使用
const require = createRequire(import.meta.url);

// 環境変数をロード
dotenv.config({ path: join(__dirname, '../../../.env') });

const getAbsolutePath = (value: string) => {
  return dirname(require.resolve(join(value, 'package.json')));
};
const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../(stories|app|components)/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  staticDirs: ['../public'],
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_SUPABASE_URL: 'https://storybook-test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon_key',
  }),
};
export default config;
