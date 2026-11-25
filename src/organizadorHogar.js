import { initOrganizerCheckout, initComparison, initEngagementTracking, initPixel } from './lib/organizerLanding';
import { trackMetaEvent } from './lib/metaPixel';

const product = {
  content_ids: ['MRB-ORG-5N'],
  content_name: 'Organizador multifuncional de 5 niveles con ruedas',
  content_type: 'product',
  currency: 'PEN',
  value: 99,
};

const bundles = Object.fromEntries([1, 2].map(quantity => [quantity, {
  quantity,
  price: product.value * quantity,
  offerLabel: quantity === 1 ? '1 unidad' : '2 unidades',
}]));

const sectionMap = [
  { selector: '.compare-section', name: 'antes_y_despues', isInfo: true },
  { selector: '#detalles', name: 'detalles_del_producto', isInfo: true },
  { selector: '#ambientes', name: 'ideas_espacios', isInfo: true },
  { selector: '#medidas', name: 'medidas_y_materiales', isInfo: true },
  { selector: '.trust', name: 'compra_con_marubi', isInfo: true },
  { selector: '#preguntas', name: 'preguntas_frecuentes', isInfo: true },
  { selector: '#pedido', name: 'seccion_oferta', isInfo: false },
];

initOrganizerCheckout({
  product,
  bundles,
  getColor: () => 'Negro',
  limaFee: 0,
  trackRegistrationAttempts: false,
  trackOrderFormSubmitted: false,
  strictValidation: true,
});
initComparison(product, { useTrackMetaEvent: true });
initPixel(product, { viewContentOnScroll: true });
initEngagementTracking(product, {
  viewContentOnScroll: true,
  sectionMap,
  useTrackMetaEvent: true,
});

document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
  link.addEventListener('click', () => {
    trackMetaEvent('Contact', {
      ...product,
      contact_channel: 'WhatsApp',
      placement: link.dataset.contact || 'whatsapp',
    });
  });
});

const path = '/assets/organizador-5/';
const scenes = [
  {
    src: path + 'hero-720.webp',
    srcset: `${path}hero-480.webp 480w, ${path}hero-720.webp 720w, ${path}hero.webp 960w`,
    mobilePreload: path + 'hero-720.webp',
    desktopPreload: path + 'hero.webp',
    label: 'En la cocina',
    alt: 'Organizador negro de cinco niveles con ruedas en una cocina',
    fit: 'cover',
  },
  {
    src: path + 'aislado-480.webp',
    srcset: `${path}aislado-480.webp 480w, ${path}aislado.webp 720w`,
    mobilePreload: path + 'aislado-480.webp',
    desktopPreload: path + 'aislado.webp',
    label: 'Vista completa',
    alt: 'Dos repisas planas y tres canastas sobre ruedas',
    fit: 'contain',
  },
  {
    src: path + 'detalle-480.webp',
    srcset: `${path}detalle-480.webp 480w, ${path}detalle.webp 840w`,
    mobilePreload: path + 'detalle-480.webp',
    desktopPreload: path + 'detalle.webp',
    label: 'Detalle del organizador',
    alt: 'Detalle de la estructura del organizador negro',
    fit: 'cover',
  },
];

let current = 0;
const photo = document.querySelector('#main-scene');
function showScene(step) {
  current = (current + step + scenes.length) % scenes.length;
  const scene = scenes[current];
  photo.srcset = scene.srcset;
  photo.src = scene.src;
  photo.alt = scene.alt;
  photo.style.objectFit = scene.fit;
  document.querySelector('#scene-caption').textContent = scene.label;
  document.querySelector('#scene-count').textContent = (current + 1) + ' / ' + scenes.length;
}
document.querySelector('#previous-scene').addEventListener('click', () => showScene(-1));
document.querySelector('#next-scene').addEventListener('click', () => showScene(1));

// Soporte táctil (swipe) para la galería en móviles
const galleryEl = document.querySelector('.gallery');
let touchStartX = 0;
let touchStartY = 0;
galleryEl?.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });
galleryEl?.addEventListener('touchend', (e) => {
  if (!e.changedTouches.length) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    showScene(dx < 0 ? 1 : -1);
  }
}, { passive: true });

// Precarga diferida de las otras vistas de galería según tamaño de pantalla
window.addEventListener('load', () => {
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200));
  idle(() => {
    if (navigator.connection?.saveData) return;
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    scenes.slice(1).forEach(scene => {
      const image = new Image();
      image.src = isMobile ? scene.mobilePreload : scene.desktopPreload;
    });
  });
}, { once: true });
