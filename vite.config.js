import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { resolve } from "path";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: "cleanupIds",
            params: {
              remove: false, // 不移除 ID
              minify: false, // 不縮短 ID 名稱
            },
          },
        ],
      },
    }),
    vueDevTools(),
  ],
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
