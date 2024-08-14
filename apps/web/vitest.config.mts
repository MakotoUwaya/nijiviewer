import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      extension: [".ts", ".tsx"],
      include: ["components/**", "app/**"],
      exclude: ["**/*.?(stories|test|spec).ts?(x)"],
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
  },
});
