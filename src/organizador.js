import { PERU_LOCATIONS } from './data/peruLocations';
import { createOrderId, saveOrder } from './lib/orders';

// Esta ficha usa el mismo píxel que la portada de MARUBI.
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
    offerLabel: '1 unidad · Color Blanco (S/ 79)',
  },
  2: {
    quantity: 2,
    price: 144,
    offerLabel: 'Promo 2x · 2 Unidades Color Blanco (2x S/ 144)',
  },
};

function formatSoles(amount) {
  return `S/. ${Number(amount || 0).toFixed(2)}`;
}

function initPixel() {
  if (!window.fbq) {
    const fbq = function (...args) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = window._fbq = fbq;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(script);
    fbq('init', '1635217208321987');
  }
  window.fbq('track', 'PageView');
  window.fbq('track', 'ViewContent', product);
}

const scenes = [
  {
    file: 'sala',
    label: 'Sala junto a la ventana',
    alt: 'Organizador metálico blanco de seis plataformas con plantas, junto a una ventana',
    srcset: '/assets/organizador-plantas/sala-movil.webp 640w, /assets/organizador-plantas/sala.webp 1122w',
  },
  {
    file: 'balcon',
    label: 'Balcón pequeño',
    alt: 'Organizador de seis plataformas con macetas en un balcón cubierto',
  },
  {
    file: 'despues',
    label: 'Rincón de jardinería interior',
    alt: 'Plantas en el organizador escalonado junto a un cuadro botánico',
  },
];

let currentScene = 0;
function showScene(step) {
  currentScene = (currentScene + step + scenes.length) % scenes.length;
  const scene = scenes[currentScene];
  const photo = document.querySelector('#hero-photo');
  if (scene.srcset) photo.srcset = scene.srcset;
  else photo.removeAttribute('srcset');
  photo.src = '/assets/organizador-plantas/' + scene.file + '.webp';
  photo.alt = scene.alt;
  document.querySelector('#gallery-caption').textContent = scene.label;
  document.querySelector('#gallery-position').textContent = (currentScene + 1) + ' / ' + scenes.length;
}
document.querySelector('#gallery-prev').addEventListener('click', () => showScene(-1));
document.querySelector('#gallery-next').addEventListener('click', () => showScene(1));

const range = document.querySelector('#compare-range');
range.addEventListener('input', () => {
  const value = range.valueAsNumber;
  document.querySelector('#comparison').style.setProperty('--split', value + '%');
  range.setAttribute('aria-valuetext', value + ' % antes y ' + (100 - value) + ' % después');
});

const menu = document.querySelector('#product-nav');
const toggle = document.querySelector('.menu-toggle');
function toggleMenu(open) {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
}
toggle.addEventListener('click', () => toggleMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', () => toggleMenu(false));

// Modal de Checkout
const modalOverlay = document.querySelector('#checkoutDrawerOverlay');
const closeBtn = document.querySelector('#closeCheckoutBtn');
const bundleCards = document.querySelectorAll('[data-bundle-qty]');
const subtotalEl = document.querySelector('#codSubtotal');
const totalEl = document.querySelector('#codTotal');
const provinciaSelect = document.querySelector('#drawerProvincia');
const ciudadSelect = document.querySelector('#drawerCiudad');
const whatsappInput = document.querySelector('#drawerWhatsapp');
const whatsappGroup = document.querySelector('#whatsappGroup');
const whatsappError = document.querySelector('#whatsappError');
const orderForm = document.querySelector('#drawerOrderForm');
const submitBtn = document.querySelector('#drawerSubmitBtn');
const submitText = document.querySelector('#drawerSubmitText');
const submitError = document.querySelector('#submitError');

let selectedQty = 1;
let pendingOrderId = null;
let isSubmitting = false;

// Poblar provincias
Object.keys(PERU_LOCATIONS).forEach((prov) => {
  const opt = document.createElement('option');
  opt.value = prov;
  opt.textContent = prov;
  provinciaSelect.appendChild(opt);
});

provinciaSelect.addEventListener('change', () => {
  const prov = provinciaSelect.value;
  ciudadSelect.innerHTML = '<option value="" disabled selected>Selecciona Ciudad / Distrito</option>';
  if (prov && PERU_LOCATIONS[prov]) {
    const ciudades = Array.from(new Set(Object.values(PERU_LOCATIONS[prov]).flat()));
    ciudades.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      ciudadSelect.appendChild(opt);
    });
    ciudadSelect.disabled = false;
  } else {
    ciudadSelect.disabled = true;
  }
});

function selectBundle(qty) {
  selectedQty = BUNDLES[qty] ? Number(qty) : 1;
  const active = BUNDLES[selectedQty];
  bundleCards.forEach((card) => {
    const isSel = Number(card.dataset.bundleQty) === selectedQty;
    card.classList.toggle('selected', isSel);
  });
  const formatted = formatSoles(active.price);
  subtotalEl.textContent = formatted;
  totalEl.textContent = formatted;
}

bundleCards.forEach((card) => {
  card.addEventListener('click', () => selectBundle(Number(card.dataset.bundleQty)));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectBundle(Number(card.dataset.bundleQty));
    }
  });
});

function openCheckout(initialQty = 1) {
  selectBundle(initialQty);
  submitError.hidden = true;
  modalOverlay.hidden = false;
  modalOverlay.classList.add('active');
  document.body.classList.add('modal-open');
  const active = BUNDLES[selectedQty];
  window.fbq?.('track', 'InitiateCheckout', {
    ...product,
    num_items: active.quantity,
    value: active.price,
  });
}

function closeCheckout() {
  modalOverlay.classList.remove('active');
  modalOverlay.hidden = true;
  document.body.classList.remove('modal-open');
  pendingOrderId = null;
}

document.querySelectorAll('[data-open-checkout]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const qty = Number(btn.dataset.openCheckout) || 1;
    openCheckout(qty);
  });
});

closeBtn.addEventListener('click', closeCheckout);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeCheckout();
});

whatsappInput.addEventListener('input', () => {
  const digits = whatsappInput.value.replace(/\D/g, '').slice(0, 9);
  whatsappInput.value = digits;
  if (digits && !/^9\d{8}$/.test(digits)) {
    whatsappGroup.classList.add('is-invalid');
    whatsappError.textContent = 'Escribe 9 dígitos y empieza con 9.';
    whatsappError.hidden = false;
  } else {
    whatsappGroup.classList.remove('is-invalid');
    whatsappError.hidden = true;
  }
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  submitError.hidden = true;

  const nombre = document.querySelector('#drawerNombre').value.trim();
  const whatsapp = whatsappInput.value.trim();
  const direccion = document.querySelector('#drawerDireccion').value.trim();
  const referencia = document.querySelector('#drawerReferencia').value.trim();
  const provincia = provinciaSelect.value;
  const ciudad = ciudadSelect.value;

  if (!/^9\d{8}$/.test(whatsapp)) {
    whatsappGroup.classList.add('is-invalid');
    whatsappError.textContent = 'Escribe 9 dígitos y empieza con 9.';
    whatsappError.hidden = false;
    whatsappInput.focus();
    return;
  }

  if (!provincia || !ciudad) {
    submitError.textContent = 'Por favor, selecciona Provincia y Ciudad.';
    submitError.hidden = false;
    return;
  }

  const active = BUNDLES[selectedQty];
  const orderNumber = pendingOrderId || createOrderId();
  pendingOrderId = orderNumber;
  const isProvincia = provincia !== 'Lima' && provincia !== 'Callao';
  const envioTexto = isProvincia
    ? 'Envío por Shalom (Provincia)'
    : 'Contraentrega en Lima según cobertura';

  const waText =
    `¡Hola MARUBI! Acabo de realizar mi pedido en la tienda:%0A%0A` +
    `📦 *Pedido:* %23${orderNumber}%0A` +
    `🛍️ *Producto:* ${encodeURIComponent(product.content_name)}%0A` +
    `🎨 *Color:* Blanco%0A` +
    `🔢 *Opción:* ${encodeURIComponent(active.offerLabel)}%0A` +
    `💰 *Total:* ${encodeURIComponent(formatSoles(active.price))}%0A` +
    `🚚 *Envío:* ${encodeURIComponent(envioTexto)}%0A%0A` +
    `👤 *Nombre y Apellidos:* ${encodeURIComponent(nombre)}%0A` +
    `📱 *Celular con WhatsApp:* ${whatsapp}%0A` +
    `🏠 *Dirección completa:* ${encodeURIComponent(direccion)}%0A` +
    `📍 *Referencias:* ${encodeURIComponent(referencia)}%0A` +
    `🗺️ *Ubicación:* ${encodeURIComponent(ciudad)}, ${encodeURIComponent(provincia)}%0A%0A` +
    `Deseo confirmar la entrega de mi pedido. ¡Gracias!`;

  const whatsappTab = window.open('', '_blank');
  if (whatsappTab) whatsappTab.opener = null;

  isSubmitting = true;
  submitBtn.disabled = true;
  submitText.textContent = 'Abriendo WhatsApp…';

  try {
    await saveOrder({
      orderId: orderNumber,
      productId: 'YH1001-1A',
      productName: product.content_name,
      offer: active.offerLabel,
      quantity: active.quantity,
      total: active.price,
      name: nombre,
      whatsapp,
      department: provincia,
      province: provincia,
      district: ciudad,
      address: direccion,
      reference: referencia,
      pageUrl: window.location.href,
    });
  } catch {
    // Incluso si la hoja tarda en confirmar, permitimos continuar a WhatsApp con todos sus datos.
  }

  window.fbq?.('trackCustom', 'OrderFormSubmitted', {
    content_ids: product.content_ids,
    value: active.price,
    currency: 'PEN',
  });

  const whatsappUrl = `https://wa.me/51910247625?text=${waText}`;
  if (whatsappTab) whatsappTab.location.href = whatsappUrl;
  else window.location.href = whatsappUrl;

  closeCheckout();
  isSubmitting = false;
  submitBtn.disabled = false;
  submitText.textContent = 'Enviar Pedido a WhatsApp';
  orderForm.reset();
  ciudadSelect.disabled = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!modalOverlay.hidden) {
      closeCheckout();
      return;
    }
    if (toggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      toggle.focus();
    }
  }
});
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !toggle.contains(event.target)) toggleMenu(false);
});

initPixel();
document.querySelectorAll('a[data-contact]').forEach((link) => {
  link.addEventListener('click', () => {
    window.fbq?.('track', 'Contact', { ...product, contact_channel: 'WhatsApp', placement: link.dataset.contact });
  });
});
