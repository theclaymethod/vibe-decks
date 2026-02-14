import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "path";

const SHARED_SRC = resolve(__dirname, "../../src");
const BUILDER_PORT = Number(process.env.BUILDER_PORT) || 3333;

export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, "../../public"),
  cacheDir: resolve(__dirname, "node_modules/.vite"),
  plugins: [
    TanStackRouterVite({
      routesDirectory: resolve(__dirname, "routes"),
      generatedRouteTree: resolve(__dirname, "routeTree.gen.ts"),
    }),
    viteTsConfigPaths({
      projects: [resolve(__dirname, "tsconfig.json")],
    }),
    tailwindcss(),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@/": SHARED_SRC + "/",
    },
  },
  server: {
    watch: {
      ignored: ["**/routeTree.gen.ts"],
    },
    proxy: {
      "/api": {
        target: `http://localhost:${BUILDER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    minify: "esbuild",
    target: "esnext",
  },
});
