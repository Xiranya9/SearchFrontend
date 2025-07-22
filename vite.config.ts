import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/search/",
  server: {
    allowedHosts: [
      "hdnla.asia/search/",
      "alita.cpolar.top",
      "localhost",
      "127.0.0.1",
      "你的本地IP",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:9090", // 后端API地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
