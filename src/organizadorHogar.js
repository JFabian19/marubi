import { initOrganizerCheckout, initComparison, initEngagementTracking, initPixel } from './lib/organizerLanding';

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
initOrganizerCheckout({ product, bundles, getColor: () => 'Negro', limaFee: 0 });
initComparison(product);
initPixel(product);
initEngagementTracking(product);
document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
  link.addEventListener('click', () => window.fbq?.('track', 'Contact', { ...product, contact_channel: 'WhatsApp' }));
});

const scenes = [
  ['hero', 'En la cocina', 'Organizador negro de cinco niveles con ruedas en una cocina'],
  ['aislado', 'Vista completa', 'Dos repisas planas y tres canastas sobre ruedas'],
  ['detalle', 'Detalle del organizador', 'Detalle de la estructura del organizador negro'],
];
let current = 0;
const photo = document.querySelector('#main-scene');
function showScene(step) {
  current = (current + step + scenes.length) % scenes.length;
  const [file, label, alt] = scenes[current];
  const path = '/assets/organizador-5/';
  if (current === 0) photo.srcset = path + 'hero-480.webp 480w, ' + path + 'hero.webp 1050w';
  else photo.removeAttribute('srcset');
  photo.src = path + file + '.webp';
  photo.alt = alt;
  photo.style.objectFit = current === 1 ? 'contain' : 'cover';
  document.querySelector('#scene-caption').textContent = label;
  document.querySelector('#scene-count').textContent = (current + 1) + ' / ' + scenes.length;
}
document.querySelector('#previous-scene').addEventListener('click', () => showScene(-1));
document.querySelector('#next-scene').addEventListener('click', () => showScene(1));
