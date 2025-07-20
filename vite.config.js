import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style.scss" as *;`,
      },
    },
  },
});
