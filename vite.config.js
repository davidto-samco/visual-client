import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ADDRESS = "http://10.10.10.30:3006";
const LOCAL_SERVER_ADDRESS = "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: SERVER_ADDRESS,
        //target: LOCAL_SERVER_ADDRESS,
        changeOrigin: true,
      },
    },
  },
});
