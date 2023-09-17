import React from "react";
import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>My Project</span>,
  project: {
    link: "https://github.com/MakotoUwaya/nextra-docs-sample",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase:
    "https://github.com/MakotoUwaya/nextra-docs-sample/blob/main",
  footer: {
    text: "Nextra Docs Sample",
  },
};

export default config;
