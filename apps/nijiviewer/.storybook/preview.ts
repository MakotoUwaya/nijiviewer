import type { Preview } from '@storybook/nextjs';
import { DateTime, Settings } from 'luxon';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import '@/styles/globals.css';
import { handlers } from './mocks/handlers';

// MSWの初期化（ハンドラーを登録）
initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: './mockServiceWorker.js',
  },
});

Settings.now = () => new Date('2025-01-01T00:30:00.000+0900').valueOf();
DateTime.local().toISO();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers,
    },
  },
  decorators: [mswDecorator],
};

export default preview;
