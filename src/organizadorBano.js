import { initOrganizerCheckout, initPixel, initEngagementTracking } from './lib/organizerLanding';

const product = {
  content_ids: ['MRB-BANO-METAL'],
  content_name: 'Organizador para baño de metal',
  content_type: 'product',
  value: 69,
  currency: 'PEN',
};

const bundles = {
  1: { quantity: 1, price: 69, offerLabel: '1 unidad · 1 kit completo · S/69' },
  2: { quantity: 2, price: 104, offerLabel: '2 unidades · 2 kits completos · S/104' },
};

initOrganizerCheckout({
  product,
  bundles,
  getColor: () => 'Negro',
  limaFee: 0,
  provincialFee: 0,
  provincialAdvance: 20,
  provincialNote: 'Envío gratis por Shalom. Adelanto de S/20 y el resto lo pagas cuando llegue a agencia.',
  requireProvincialAcceptance: true,
  strictValidation: true,
});

const sectionMap = [
  { selector: '#detalles', name: 'beneficios', isInfo: true },
  { selector: '#incluye', name: 'que_incluye', isInfo: true },
  { selector: '.bath-duo', name: 'promo_doble', isInfo: false },
  { selector: '#preguntas', name: 'preguntas_frecuentes', isInfo: true },
];

initPixel(product);
initEngagementTracking(product, {
  viewContentOnScroll: false,
  sectionMap,
  useTrackMetaEvent: true,
});

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
