import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    include: ["**/*.spec.js"],
    environment: "jsdom",
    setupFiles: "setup.js",
  },
});
