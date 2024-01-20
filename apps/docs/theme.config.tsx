import React from "react";
import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>OiChan Docs</span>,
  project: {
    link: "https://github.com/MakotoUwaya/nijiviewer",
  },
  docsRepositoryBase:
    "https://github.com/MakotoUwaya/nijiviewer/blob/main",
  footer: {
    text: "Powered by Nextra",
  },
};

export default config;
