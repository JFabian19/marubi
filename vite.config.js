import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const plantPage = '/producto/organizador-de-plantas-6-niveles';

// Match the clean product URL served by the Cloudflare Pages rewrite in local previews.
function servePlantPage(server) {
  server.middlewares.use((req, _res, next) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === plantPage || url.pathname === plantPage + '/') {
      req.url = plantPage + '/index.html' + url.search;
    }
    next();
  });
}

export default defineConfig({
  plugins: [react(), {
    name: 'plant-product-page',
    configureServer: servePlantPage,
    configurePreviewServer: servePlantPage,
  }],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        organizador: 'producto/organizador-de-plantas-6-niveles/index.html',
      },
    },
  },
});
