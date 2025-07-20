import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/quiz": {
        target: "http://localhost:3000", // Replace with your backend server URL
        changeOrigin: true,
      },
      "/results": {
        target: "http://localhost:3000", // Replace with your backend server URL
        changeOrigin: true,
      },
    },
  },
});
