import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/searchengine/",
  server: {
    port: 3000,
    allowedHosts: [
      "hdnla.asia/searchengine/",
      "alita.cpolar.top",
      "localhost",
      "127.0.0.1",
      "http://localhost:3000",
    ],
    proxy: {
      "/api": {
        target: "http://hdnla.asia:9093", // 后端API地址
        changeOrigin: true, // 允许跨域
        /**
         * 重写路径，移除路径中的 `/api` 前缀。
         * @param {string} path - 原始路径字符串。
         * @returns {string} 移除 `/api` 前缀后的路径。
         */
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
