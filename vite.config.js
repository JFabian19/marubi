import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const plantPage = '/producto/organizador-de-plantas-6-niveles';
const thankYouPage = '/gracias-por-tu-compra';

// Match the clean product and thank-you URLs served by Cloudflare Pages rewrites in local previews.
function servePlantPage(server) {
  server.middlewares.use((req, _res, next) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === plantPage || url.pathname === plantPage + '/') {
      req.url = plantPage + '/index.html' + url.search;
    } else if (url.pathname === thankYouPage || url.pathname === thankYouPage + '/') {
      req.url = thankYouPage + '/index.html' + url.search;
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
        gracias: 'gracias-por-tu-compra/index.html',
      },
    },
  },
});
