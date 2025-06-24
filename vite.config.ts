import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

const hostName = "http://8.133.240.77:8080";
// "https://csr.onaliyun.com";
// "http://localhost:8999";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    // port: 8016,
    proxy: {
      '/api': {
        target: hostName,
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:8999',
        changeOrigin: true,
      }
    },
  }
});
