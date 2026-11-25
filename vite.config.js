import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';

const plantPage = '/producto/organizador-de-plantas-6-niveles';
const homeOrganizerPage = '/producto/organizador-5-niveles';
const thankYouPage = '/graciasportucompra';

// Match the clean product and thank-you URLs served by Cloudflare Pages rewrites in local previews.
function servePlantPage(server) {
  server.middlewares.use((req, _res, next) => {
    const url = new URL(req.url, 'http://localhost');
    const productPage = [plantPage, homeOrganizerPage].find(path => url.pathname === path || url.pathname === path + '/');
    if (productPage) {
      req.url = productPage + '/index.html' + url.search;
    } else if (
      url.pathname === thankYouPage ||
      url.pathname === thankYouPage + '/' ||
      url.pathname === '/gracias-por-tu-compra' ||
      url.pathname === '/gracias-por-tu-compra/'
    ) {
      req.url = thankYouPage + '/index.html' + url.search;
    }
    next();
  });
}

export default defineConfig({
  plugins: [react(), {
    name: 'organizer-product-pages',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('<!-- organizer-order-form -->', () => readFileSync(new URL('./src/components/organizerOrderForm.html', import.meta.url), 'utf8'));
      },
    },
    configureServer: servePlantPage,
    configurePreviewServer: servePlantPage,
  }],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        organizador: 'producto/organizador-de-plantas-6-niveles/index.html',
        organizadorHogar: 'producto/organizador-5-niveles/index.html',
        gracias: 'graciasportucompra/index.html',
      },
    },
  },
});
