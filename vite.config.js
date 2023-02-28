import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import forwardToTrailingSlashPlugin from "./forward-to-trailing-slash-plugin.js";

const build = {
  rollupOptions: {
    input: {
      main: resolve(__dirname, "index.html"),
      classes: resolve(__dirname, "classes/index.html"),
      donate: resolve(__dirname, "donate/index.html"),
      live: resolve(__dirname, "live/index.html"),
      register: resolve(__dirname, "register/index.html"),
      history: resolve(__dirname, "history/index.html"),
      fscalendar: resolve(__dirname, "fscalendar/index.html"),
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      forwardToTrailingSlashPlugin(Object.keys(build.rollupOptions.input)),
      react(),
    ],
    base: env.VITE_BASE ?? "/",
    appType: "mpa",
    build,
  };
});
