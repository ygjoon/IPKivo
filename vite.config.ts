import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const headers = {
  "Content-Security-Policy": "frame-ancestors 'none'",
  "X-Frame-Options": "DENY",
};

export default defineConfig(() => {
  // Evaluated by Vite at build time, not when a visitor opens the page.
  const buildTime = new Date().toISOString();
  const deploymentCommit =
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.WORKERS_CI_COMMIT_SHA ??
    process.env.GITHUB_SHA;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "app-build-version",
        generateBundle() {
          this.emitFile({
            type: "asset",
            fileName: "app-version.json",
            source: JSON.stringify({
              build: buildTime,
              ...(deploymentCommit ? { commit: deploymentCommit } : {}),
            }),
          });
        },
      },
    ],
    optimizeDeps: {
      include: ["vaul", "@fingerprintjs/fingerprintjs"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("echarts") || id.includes("zrender"))
              return "vendor-echarts";
            if (id.includes("leaflet")) return "vendor-leaflet";
            if (id.includes("gsap")) return "vendor-gsap";
            if (id.includes("@tanstack")) return "vendor-tanstack";
            if (id.includes("radix-ui") || id.includes("@radix-ui"))
              return "vendor-radix";
          },
        },
      },
    },
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    define: {
      "import.meta.env.VITE_BUILD_TIME": JSON.stringify(buildTime),
    },
    server: {
      host: "127.0.0.1",
      port: 5137,
      hmr: { clientPort: 8787 },
      strictPort: true,
      open: false,
      headers,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8787",
          changeOrigin: false,
        },
      },
    },
    preview: { headers },
  };
});
