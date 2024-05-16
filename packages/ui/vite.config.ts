import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "./build",
  },
});
