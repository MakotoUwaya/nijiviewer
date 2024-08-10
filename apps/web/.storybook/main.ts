import type { StorybookConfig } from "@storybook/nextjs";

import { dirname, join } from "node:path";

const getAbsolutePath = (value: string) => {
  return dirname(require.resolve(join(value, "package.json")));
};
const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../(stories|app|components)/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  staticDirs: ["..\\public"],
};
export default config;
