import { initOrganizerCheckout, initComparison, initEngagementTracking, initPixel } from './lib/organizerLanding';
import { trackMetaEvent } from './lib/metaPixel';

const product = {
  content_ids: ['MRB-ORG-5N'],
  content_name: 'Organizador multifuncional de 5 niveles con ruedas',
  content_type: 'product',
  currency: 'PEN',
  value: 99,
};

const bundles = {
  1: { quantity: 1, price: 99, offerLabel: 'Oferta 1 unidad · ahorras S/ 30' },
  2: { quantity: 2, price: 180, offerLabel: 'Promoción 2 unidades · ahorras S/ 78' },
};

const sectionMap = [
  { selector: '#video', name: 'video_del_producto', isInfo: true },
  { selector: '.compare-section', name: 'antes_y_despues', isInfo: true },
  { selector: '#detalles', name: 'detalles_del_producto', isInfo: true },
  { selector: '#medidas', name: 'medidas_y_materiales', isInfo: true },
  { selector: '#ambientes', name: 'ideas_espacios', isInfo: true },
  { selector: '.trust', name: 'promo_doble', isInfo: false },
  { selector: '#preguntas', name: 'preguntas_frecuentes', isInfo: true },
  { selector: '#pedido', name: 'seccion_oferta', isInfo: false },
];

initOrganizerCheckout({
  product,
  bundles,
  getColor: () => 'Negro',
  limaFee: 0,
  provincialFee: 20,
  provincialAdvance: 40,
  trackRegistrationAttempts: false,
  trackOrderFormSubmitted: false,
  strictValidation: true,
});

initComparison(product, { useTrackMetaEvent: true });
initPixel(product);
initEngagementTracking(product, {
  viewContentOnScroll: false,
  sectionMap,
  useTrackMetaEvent: true,
});

document.querySelectorAll('a[href^="https://wa.me"]').forEach((link) => {
  link.addEventListener('click', () => {
    trackMetaEvent('Contact', {
      ...product,
      contact_channel: 'WhatsApp',
      placement: link.dataset.contact || 'whatsapp',
    });
  });
});

// Instant pre-decoded Shopify gallery switcher
const slides = new Map();
document.querySelectorAll('[data-slide]').forEach((img) => {
  slides.set(img.dataset.slide, img);
});

const thumbButtons = Array.from(document.querySelectorAll('[data-scene]'));

function warmDecodeSlides() {
  slides.forEach((img) => {
    if (!img.complete) return;
    img.decode?.().catch(() => {});
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener?.('load', warmDecodeSlides, { once: true });
}

function showScene(scene) {
  if (!slides.has(scene)) return;
  slides.forEach((img, key) => {
    img.classList.toggle('is-active', key === scene);
    img.setAttribute('aria-hidden', String(key !== scene));
  });
  thumbButtons.forEach((item) => {
    item.setAttribute('aria-pressed', String(item.dataset.scene === scene));
  });
}

thumbButtons.forEach((button) => {
  const scene = button.dataset.scene;
  button.addEventListener('pointerdown', () => {
    slides.get(scene)?.decode?.().catch(() => {});
  }, { passive: true });
  button.addEventListener('click', () => showScene(scene));
});
