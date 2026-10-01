import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleJeremiahApi } from "./server/apiHandler.mjs";
import { handleBibleApi } from "./server/bibleHandler.mjs";

function jeremiahApiPlugin() {
  return {
    name: "jeremiah-api",
    configureServer(server) {
      server.middlewares.use("/api/jeremiah/teach", (req, res) => {
        void handleJeremiahApi(req, res);
      });
      server.middlewares.use("/api/bible/chapter", (req, res) => {
        void handleBibleApi(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), jeremiahApiPlugin()],
  };
});
