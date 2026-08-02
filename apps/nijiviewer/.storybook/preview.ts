import type { Preview } from '@storybook/nextjs-vite';
import { DateTime, Settings } from 'luxon';
import { mswLoader } from 'msw-storybook-addon/csf3';
import '@/styles/globals.css';
import { handlers } from './mocks/handlers';

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
  loaders: [mswLoader()],
};

export default preview;
