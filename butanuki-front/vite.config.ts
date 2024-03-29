import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";

function spaFallbackWithDot() {
  return {
    name: "spa-fallback-with-dot",
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.url.includes(".") && !req.url.endsWith(".html")) {
            req.url = "/index.html";
          }
          next();
        });
      };
    },
    configurePreviewServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.url.includes(".") && !req.url.endsWith(".html")) {
            req.url = "/index.html";
          }
          next();
        });
      };
    },
  };
}
function pluginIndexHtmlHeaders(): PluginOption {
  return {
    name: "plugin-index-headers",
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          const skipExtensions = [
            ".js",
            ".css",
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".ico",
            ".woff",
            ".woff2",
            ".ttf",
            ".eot",
            ".otf",
            ".map",
          ];
          if (skipExtensions.some((ext) => req.originalUrl.endsWith(ext))) {
            return next();
          }
          res.setHeader("Link", '</api/config>; rel="preload"; as="fetch"');
          next();
        });
      };
    },
  };
}
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    react(),
    viteBasicSslPlugin(),
    spaFallbackWithDot(),
    pluginIndexHtmlHeaders(),
  ],
  build: {
    assetsInlineLimit: 1024 * 1024,
  },
  server: {
    https: true,
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://192.168.1.13:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    https: true,
    port: 3000,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
