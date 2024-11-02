import type { DocsThemeConfig } from 'nextra-theme-docs';
import React from 'react';

const config: DocsThemeConfig = {
  logo: <span>OiChan Docs</span>,
  project: {
    link: 'https://github.com/MakotoUwaya/nijiviewer',
  },
  docsRepositoryBase: 'https://github.com/MakotoUwaya/nijiviewer/blob/main',
  footer: {
    content: 'Powered by Nextra',
  },
};

export default config;
