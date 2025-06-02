import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    // port: 8016,
    proxy: {
      '/api': {
        target: 'http://localhost:8999',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:8999',
        changeOrigin: true,
      }
    },
  }
});
