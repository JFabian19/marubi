import { initOrganizerCheckout, initPixel, initComparison, initEngagementTracking } from './lib/organizerLanding';

const product = {
  content_ids: ['YH1001-1A'],
  content_name: 'Organizador Metálico para Plantas de 6 Niveles MARUBI',
  content_type: 'product',
  value: 79,
  currency: 'PEN',
};

const BUNDLES = {
  1: {
    quantity: 1,
    price: 79,
    oldPrice: 129,
    offerLabel: '1 unidad (S/ 79 · Antes S/ 129)',
  },
  2: {
    quantity: 2,
    price: 144,
    oldPrice: 258,
    offerLabel: 'Promo 2x · 2 Unidades (2x S/ 144 · Antes S/ 258)',
  },
};

const scenes = [
  { file: 'sala', label: 'Sala junto a la ventana' },
  { file: 'balcon', label: 'Balcón cubierto' },
  { file: 'despues', label: 'Rincón de jardinería interior' },
];
let selectedColor = 'Blanco';
let currentScene = 0;
const imageRoot = '/assets/organizador-plantas/';

function setProductImage(image, asset) {
  const color = selectedColor.toLowerCase();
  const base = `${imageRoot}${asset}-${color}`;
  if (image.classList.contains('cod-bundle-img')) {
    image.src = `${imageRoot}sala-${color}-thumb.webp`;
  } else {
    // Keep both responsive candidates when switching color or gallery slide.
    image.srcset = `${base}-movil.webp 720w, ${base}-desktop.webp 1280w`;
    image.src = `${base}-desktop.webp`;
  }
  image.alt = `${image.dataset.description || 'Organizador de seis plataformas'} · Color ${color}`;
}

function syncProductColorImages() {
  document.querySelectorAll('[data-product-image]').forEach(image => {
    setProductImage(image, image.dataset.productImage);
  });
}

function showScene(step) {
  currentScene = (currentScene + step + scenes.length) % scenes.length;
  const scene = scenes[currentScene];
  const photo = document.querySelector('#hero-photo');
  photo.dataset.productImage = scene.file;
  photo.dataset.description = `Organizador completo, sin ruedas: ${scene.label}`;
  setProductImage(photo, scene.file);
  document.querySelector('#gallery-caption').textContent = scene.label;
  document.querySelector('#gallery-position').textContent = `${currentScene + 1} / ${scenes.length}`;
}
document.querySelector('#gallery-prev').addEventListener('click', () => showScene(-1));
document.querySelector('#gallery-next').addEventListener('click', () => showScene(1));

// Soporte táctil (swipe) para la galería en móviles
const heroGallery = document.querySelector('.hero-gallery');
let touchStartX = 0;
let touchStartY = 0;
heroGallery?.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  },
  { passive: true }
);
heroGallery?.addEventListener(
  'touchend',
  (e) => {
    if (!e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      showScene(dx < 0 ? 1 : -1);
    }
  },
  { passive: true }
);

// Preload only the selected color at the appropriate viewport size.
window.addEventListener('load', () => {
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200));
  idle(() => {
    if (navigator.connection?.saveData) return;
    const suffix = window.matchMedia('(max-width: 740px)').matches ? 'movil' : 'desktop';
    scenes.slice(1).forEach(scene => {
      const image = new Image();
      image.src = `${imageRoot}${scene.file}-${selectedColor.toLowerCase()}-${suffix}.webp`;
    });
  });
}, { once: true });

const menu = document.querySelector('#product-nav');
const toggle = document.querySelector('.menu-toggle');
function toggleMenu(open) {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
}
toggle.addEventListener('click', () => toggleMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', () => toggleMenu(false));

document.querySelectorAll('.color-selector').forEach((selector) => {
  selector.querySelectorAll('.color-option').forEach((button) => {
    button.addEventListener('click', () => {
      selectedColor = button.textContent.trim().startsWith('Negro') ? 'Negro' : 'Blanco';
      document.querySelectorAll('.color-selector .color-option').forEach((option) => {
        const active = option.textContent.trim().startsWith(selectedColor);
        option.classList.toggle('is-selected', active);
        option.setAttribute('aria-pressed', String(active));
      });
      syncProductColorImages();
      currentScene = 0;
      showScene(0);
    });
  });
});
syncProductColorImages();

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (document.querySelector('#checkoutDrawerOverlay').open) return;
    if (toggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      toggle.focus();
    }
  }
});
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !toggle.contains(event.target)) toggleMenu(false);
});

initOrganizerCheckout({ product, bundles: BUNDLES, getColor: () => selectedColor, limaFee: 0 });
initComparison(product);
initPixel(product);
initEngagementTracking(product);
document.querySelectorAll('a[data-contact]').forEach((link) => {
  link.addEventListener('click', () => {
    window.fbq?.('track', 'Contact', { ...product, contact_channel: 'WhatsApp', placement: link.dataset.contact });
  });
});
