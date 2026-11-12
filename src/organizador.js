import { PERU_LOCATIONS } from './data/peruLocations';
import { createOrderId, saveOrder } from './lib/orders';

// Esta ficha usa el mismo píxel que la portada de MARUBI (ID: 1635217208321987).
const PIXEL_ID = '1635217208321987';
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
    offerLabel: '1 unidad · Color Blanco (S/ 79 · Antes S/ 129)',
  },
  2: {
    quantity: 2,
    price: 144,
    oldPrice: 258,
    offerLabel: 'Promo 2x · 2 Unidades Color Blanco (2x S/ 144 · Antes S/ 258)',
  },
};

function formatSoles(amount) {
  return `S/. ${Number(amount || 0).toFixed(2)}`;
}

function initPixel() {
  const alreadyLoaded = typeof window.fbq === 'function';
  if (!alreadyLoaded) {
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
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }
  window.fbq('track', 'ViewContent', product);
}

// Tracking de Scroll y Visita a Secciones de Información
function initEngagementTracking() {
  let hasScrolled = false;
  const scrollMilestones = new Set();

  function checkScrollDepth() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrollTop > 40 && !hasScrolled) {
      hasScrolled = true;
      window.fbq?.('trackCustom', 'UserScrolled', { ...product });
    }
    const docHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const pct = Math.round((scrollTop / docHeight) * 100);
    [25, 50, 75, 90].forEach((milestone) => {
      if (pct >= milestone && !scrollMilestones.has(milestone)) {
        scrollMilestones.add(milestone);
        window.fbq?.('trackCustom', 'ScrollDepth', {
          ...product,
          depth_percent: milestone,
          depth: `${milestone}%`,
        });
      }
    });
  }

  window.addEventListener('scroll', checkScrollDepth, { passive: true });

  // Detectar si visitó las secciones de información del producto
  const sectionMap = [
    { selector: '.compare-section', name: 'antes_y_despues', isInfo: true },
    { selector: '.benefits', name: 'beneficios', isInfo: true },
    { selector: '#medidas', name: 'medidas_y_materiales', isInfo: true },
    { selector: '#detalles', name: 'detalles_del_producto', isInfo: true },
    { selector: '.spaces', name: 'ideas_espacios', isInfo: false },
    { selector: '#pedido', name: 'seccion_oferta', isInfo: false },
    { selector: '#preguntas', name: 'preguntas_frecuentes', isInfo: true },
  ];

  const visitedSections = new Set();
  let visitedInfoTracked = false;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionName = entry.target.dataset.trackSection;
          const isInfo = entry.target.dataset.trackInfo === 'true';
          if (sectionName && !visitedSections.has(sectionName)) {
            visitedSections.add(sectionName);
            window.fbq?.('trackCustom', 'SectionVisited', {
              ...product,
              section: sectionName,
            });
            if (isInfo && !visitedInfoTracked) {
              visitedInfoTracked = true;
              window.fbq?.('trackCustom', 'VisitedProductInfo', {
                ...product,
                first_info_section: sectionName,
              });
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    sectionMap.forEach(({ selector, name, isInfo }) => {
      const el = document.querySelector(selector);
      if (el) {
        el.dataset.trackSection = name;
        el.dataset.trackInfo = String(isInfo);
        observer.observe(el);
      }
    });
  }

  // Interacción con preguntas frecuentes
  document.querySelectorAll('#preguntas details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        const question = detail.querySelector('summary')?.textContent?.trim() || '';
        window.fbq?.('trackCustom', 'FAQOpened', { ...product, question });
      }
    });
  });
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
let compareTracked = false;
range.addEventListener('input', () => {
  const value = range.valueAsNumber;
  document.querySelector('#comparison').style.setProperty('--split', value + '%');
  range.setAttribute('aria-valuetext', value + ' % antes y ' + (100 - value) + ' % después');
  if (!compareTracked) {
    compareTracked = true;
    window.fbq?.('trackCustom', 'BeforeAfterCompared', { ...product });
  }
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

// Modal de Checkout y Ofertas
const modalOverlay = document.querySelector('#checkoutDrawerOverlay');
const closeBtn = document.querySelector('#closeCheckoutBtn');
const exitDiscountPopup = document.querySelector('#exitDiscountPopup');
const claimDiscountBtn = document.querySelector('#claimDiscountBtn');
const confirmCloseBtn = document.querySelector('#confirmCloseBtn');
const discountAppliedBanner = document.querySelector('#discountAppliedBanner');
const codDiscountRow = document.querySelector('#codDiscountRow');
const bundlePrice1El = document.querySelector('#bundlePrice1');
const bundlePrice2El = document.querySelector('#bundlePrice2');
const bundleCards = document.querySelectorAll('[data-bundle-qty]');
const landingOfferCards = document.querySelectorAll('[data-select-offer]');
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
let exitDiscountAmount = 0; // S/ 5 de descuento al darle clic a la X
let exitDiscountOffered = false;
let registrationAttemptTracked = false;
let pendingOrderId = null;
let trackedPurchaseId = null;
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

function getFinalPrice(qty) {
  const base = BUNDLES[qty]?.price || 79;
  return Math.max(0, base - exitDiscountAmount);
}

function updatePricingUI() {
  const active = BUNDLES[selectedQty];
  bundleCards.forEach((card) => {
    const isSel = Number(card.dataset.bundleQty) === selectedQty;
    card.classList.toggle('selected', isSel);
  });
  landingOfferCards.forEach((card) => {
    const isSel = Number(card.dataset.selectOffer) === selectedQty;
    card.classList.toggle('is-active', isSel);
  });

  if (bundlePrice1El) bundlePrice1El.textContent = formatSoles(getFinalPrice(1));
  if (bundlePrice2El) bundlePrice2El.textContent = formatSoles(getFinalPrice(2));

  subtotalEl.textContent = formatSoles(active.price);
  if (exitDiscountAmount > 0) {
    codDiscountRow.hidden = false;
    discountAppliedBanner.hidden = false;
  } else {
    codDiscountRow.hidden = true;
    discountAppliedBanner.hidden = true;
  }
  totalEl.textContent = formatSoles(getFinalPrice(selectedQty));
}

function selectBundle(qty) {
  selectedQty = BUNDLES[qty] ? Number(qty) : 1;
  updatePricingUI();
}

landingOfferCards.forEach((card) => {
  card.addEventListener('click', () => {
    const qty = Number(card.dataset.selectOffer) || 1;
    selectBundle(qty);
  });
});

bundleCards.forEach((card) => {
  card.addEventListener('click', () => selectBundle(Number(card.dataset.bundleQty)));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectBundle(Number(card.dataset.bundleQty));
    }
  });
});

function trackRegistrationAttempt(sourceField) {
  if (registrationAttemptTracked) return;
  registrationAttemptTracked = true;
  const active = BUNDLES[selectedQty];
  const finalPrice = getFinalPrice(selectedQty);
  const payload = {
    ...product,
    num_items: active.quantity,
    value: finalPrice,
    status: 'intento_de_registro',
    field: sourceField,
  };
  // Eventos estándar y personalizados para intento de registro al llenar datos
  window.fbq?.('track', 'CompleteRegistration', payload);
  window.fbq?.('track', 'Lead', payload);
  window.fbq?.('trackCustom', 'IntentoDeRegistro', payload);
}

['#drawerNombre', '#drawerWhatsapp', '#drawerDireccion', '#drawerReferencia', '#drawerProvincia', '#drawerCiudad'].forEach((sel) => {
  const input = document.querySelector(sel);
  if (!input) return;
  input.addEventListener('input', () => {
    if (input.value && input.value.trim().length >= 2) {
      trackRegistrationAttempt(sel);
    }
  });
  input.addEventListener('change', () => {
    if (input.value && input.value.trim().length >= 1) {
      trackRegistrationAttempt(sel);
    }
  });
});

function openCheckout(initialQty, placement = 'boton') {
  if (initialQty === 1 || initialQty === 2) {
    selectedQty = initialQty;
  }
  registrationAttemptTracked = false;
  updatePricingUI();
  submitError.hidden = true;
  exitDiscountPopup.hidden = true;
  modalOverlay.hidden = false;
  modalOverlay.classList.add('active');
  document.body.classList.add('modal-open');
  const active = BUNDLES[selectedQty];
  const finalPrice = getFinalPrice(selectedQty);
  window.fbq?.('track', 'InitiateCheckout', {
    ...product,
    num_items: active.quantity,
    value: finalPrice,
    placement,
  });
}

function forceCloseCheckout() {
  exitDiscountPopup.hidden = true;
  modalOverlay.classList.remove('active');
  modalOverlay.hidden = true;
  document.body.classList.remove('modal-open');
  pendingOrderId = null;
}

function handleAttemptClose() {
  // Si aún no se le ofreció el descuento de 5 soles al darle clic a la X, mostrárselo y activarlo
  if (!exitDiscountOffered && exitDiscountAmount === 0) {
    exitDiscountOffered = true;
    exitDiscountPopup.hidden = false;
    window.fbq?.('trackCustom', 'ExitDiscountOffered', { ...product, discount: 5 });
    return;
  }
  forceCloseCheckout();
}

claimDiscountBtn.addEventListener('click', () => {
  exitDiscountAmount = 5;
  exitDiscountPopup.hidden = true;
  updatePricingUI();
  window.fbq?.('trackCustom', 'ExitDiscountClaimed', {
    ...product,
    discount: 5,
    value: getFinalPrice(selectedQty),
  });
  document.querySelector('#drawerNombre')?.focus();
});

confirmCloseBtn.addEventListener('click', () => {
  forceCloseCheckout();
});

document.querySelectorAll('[data-open-checkout]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const attr = btn.dataset.openCheckout;
    const qty = attr === 'selected' ? selectedQty : Number(attr) || 1;
    const placement = btn.dataset.placement || 'landing';
    openCheckout(qty, placement);
  });
});

closeBtn.addEventListener('click', handleAttemptClose);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) handleAttemptClose();
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

  // Asegurar que el intento de registro quede registrado antes de la compra
  trackRegistrationAttempt('submit');

  const active = BUNDLES[selectedQty];
  const finalPrice = getFinalPrice(selectedQty);
  const offerLabel =
    exitDiscountAmount > 0
      ? `${active.offerLabel} + Descuento especial S/ 5`
      : active.offerLabel;

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
    `🔢 *Opción:* ${encodeURIComponent(offerLabel)}%0A` +
    `💰 *Total:* ${encodeURIComponent(formatSoles(finalPrice))}%0A` +
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
  submitText.textContent = 'Procesando Pedido…';

  // Disparar evento de Compra (Purchase) cuando hace clic en Realizar Pedido
  if (trackedPurchaseId !== orderNumber) {
    trackedPurchaseId = orderNumber;
    window.fbq?.(
      'track',
      'Purchase',
      {
        content_ids: product.content_ids,
        content_name: product.content_name,
        content_type: 'product',
        num_items: active.quantity,
        value: finalPrice,
        currency: 'PEN',
      },
      { eventID: orderNumber }
    );
    window.fbq?.('trackCustom', 'OrderFormSubmitted', {
      content_ids: product.content_ids,
      num_items: active.quantity,
      value: finalPrice,
      currency: 'PEN',
      order_id: orderNumber,
    });
  }

  try {
    await saveOrder({
      orderId: orderNumber,
      productId: 'YH1001-1A',
      productName: product.content_name,
      offer: offerLabel,
      quantity: active.quantity,
      total: finalPrice,
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
    // Continuar a WhatsApp con los datos del cliente.
  }

  const whatsappUrl = `https://wa.me/51910247625?text=${waText}`;
  if (whatsappTab) whatsappTab.location.href = whatsappUrl;
  else window.location.href = whatsappUrl;

  forceCloseCheckout();
  isSubmitting = false;
  submitBtn.disabled = false;
  submitText.textContent = 'Realizar Pedido';
  orderForm.reset();
  ciudadSelect.disabled = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!modalOverlay.hidden) {
      handleAttemptClose();
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
initEngagementTracking();
document.querySelectorAll('a[data-contact]').forEach((link) => {
  link.addEventListener('click', () => {
    window.fbq?.('track', 'Contact', { ...product, contact_channel: 'WhatsApp', placement: link.dataset.contact });
  });
});
