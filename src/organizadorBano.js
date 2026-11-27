import { initOrganizerCheckout, initPixel, initEngagementTracking } from './lib/organizerLanding';
const product = { content_ids: ['MRB-BANO-METAL'], content_name: 'Organizador para baño de metal', content_type: 'product', value: 69, currency: 'PEN' };
const bundles = {
  1: { quantity: 1, price: 69, offerLabel: '1 unidad · 1 kit completo · S/69' },
  2: { quantity: 2, price: 104, offerLabel: '2 unidades · 2 kits completos · S/104' },
};
initOrganizerCheckout({ product, bundles, getColor: () => 'Negro', limaFee: 0, provincialFee: 0, provincialNote: 'Envío gratis por Shalom. Adelanto de S/40 que se descuenta del total.', strictValidation: true });
initPixel(product);
initEngagementTracking(product);
const descriptions = { ambiente: 'Kit de metal negro instalado en un baño', kit: 'Dos repisas, dos jaboneras, un portacepillos y cuatro adhesivos', referencia: 'Caja y presentación original del organizador' };
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => {
  const scene = button.dataset.scene;
  const photo = document.querySelector('#bath-photo');
  photo.srcset = `/assets/organizador-bano/${scene}-640.webp 640w, /assets/organizador-bano/${scene}-1200.webp 1200w`;
  photo.src = `/assets/organizador-bano/${scene}-1200.webp`;
  photo.alt = descriptions[scene];
  document.querySelectorAll('[data-scene]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
