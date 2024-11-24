import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  optimizeDeps: {
    // 👈 optimizedeps
    esbuildOptions: {
      target: "esnext",
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      supported: {
        bigint: true,
      },
    },
  },

  define: {},

  build: {
    target: ["esnext"], // 👈 build.target
  },
});
