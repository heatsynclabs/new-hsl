import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://www.heatsynclabs.org",
  base: "/",
  integrations: [vue()],
  output: "static",
  build: {
    assets: "assets",
  },
  server: {
    port: 4321,
  },
});
