// filepath: c:\Users\makot\Documents\Node\nijiviewer\apps\web\.storybook\mocks\browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// このワーカーはブラウザ環境でリクエストをインターセプトします
export const worker = setupWorker(...handlers);