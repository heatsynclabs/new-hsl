import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      /*
       * VitePWA takes care of passing all PWA checks
       * More info at
       * https://vite-pwa-org.netlify.app/guide/
       */
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        manifest: {
          short_name: "HeatSyncLabs",
          name: "HeatSync Labs",
          description: "Website for HeatSync Labs, a makerspace in Mesa, AZ.",
          theme_color: "#f99b0c",
          icons: [
            {
              src: "/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/logo-color.svg",
              sizes: "512x512",
              type: "image/svg",
              purpose: "any maskable",
            },
          ],
          display: "standalone",
          background_color: "#f99b0c",
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    base: env.VITE_BASE ?? "/",
  };
});
