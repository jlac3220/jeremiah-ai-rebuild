import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  
  // https://vitejs.dev/config/
  export default defineConfig({
      plugins: [react()],
      define: {
        // Polyfill process.env so legacy CRA-style env vars don't crash in dev
        "process.env": {},
      },
  });
  