import { PERU_LOCATIONS } from '../data/peruLocations';
import { createOrderId, saveOrder, usesShalom, provincialDeliveryNote, PROVINCIAL_SHIPPING_FEE, PROVINCIAL_ADVANCE } from './orders';
import {
  META_PIXEL_ID,
  ensureFbcAndFbp,
  getStoredUserData,
  updateMetaUserData,
  trackMetaEvent,
  sendKeepalivePixelBeacon,
} from './metaPixel';

const PIXEL_ID = META_PIXEL_ID;

function formatSoles(amount) {
  return `S/. ${Number(amount || 0).toFixed(2)}`;
}

export function initPixel(product) {
  ensureFbcAndFbp();
  const userData = getStoredUserData();
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
    fbq('set', 'autoConfig', false, PIXEL_ID);
    fbq('init', PIXEL_ID, userData);
    window.__marubiPageViewId =
      window.__marubiPageViewId || `pv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    fbq('track', 'PageView', {}, { eventID: window.__marubiPageViewId });
  }

  if (!window.__marubiViewContentId) {
    window.__marubiViewContentId = `vc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    window.fbq('track', 'ViewContent', product, { eventID: window.__marubiViewContentId });
  }

  // Fallback si un navegador in-app o bloqueador impide cargar fbevents.js
  window.setTimeout(() => {
    if (typeof window.fbq?.callMethod !== 'function') {
      sendKeepalivePixelBeacon('PageView', {}, window.__marubiPageViewId);
      sendKeepalivePixelBeacon('ViewContent', product, window.__marubiViewContentId);
    }
  }, 1800);
}

// Tracking de Scroll y Visita a Secciones de Información
export function initEngagementTracking(product) {
  let hasScrolled = false;
  let scrollTicking = false;
  let cachedDocHeight = 1;
  const scrollMilestones = new Set();

  function updateDocHeight() {
    cachedDocHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
  }
  updateDocHeight();
  window.addEventListener('resize', updateDocHeight, { passive: true });
  window.addEventListener('load', updateDocHeight, { once: true });

  function checkScrollDepth() {
    scrollTicking = false;
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrollTop > 40 && !hasScrolled) {
      hasScrolled = true;
      window.fbq?.('trackCustom', 'UserScrolled', { ...product });
    }
    const pct = Math.round((scrollTop / cachedDocHeight) * 100);
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

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(checkScrollDepth);
      }
    },
    { passive: true }
  );

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

export function initComparison(product) {
  const range = document.querySelector('#compare-range');
  const comparisonEl = document.querySelector('#comparison');
  let compareTracked = false;
  let compareFrame = null;
  range.addEventListener('input', () => {
    const value = range.valueAsNumber;
    if (compareFrame) cancelAnimationFrame(compareFrame);
    compareFrame = requestAnimationFrame(() => {
      comparisonEl.style.setProperty('--split', value + '%');
      range.setAttribute('aria-valuetext', value + ' % antes y ' + (100 - value) + ' % después');
    });
    if (!compareTracked) {
      compareTracked = true;
      window.fbq?.('trackCustom', 'BeforeAfterCompared', { ...product });
    }
  });
}

export function initOrganizerCheckout({ product, bundles: BUNDLES, getColor, limaFee }) {
  const modalOverlay = document.querySelector('#checkoutDrawerOverlay');
  const closeBtn = document.querySelector('#closeCheckoutBtn');
  const exitDiscountPopup = document.querySelector('#exitDiscountPopup');
  const closeExitPopupBtn = document.querySelector('#closeExitPopupBtn');
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
  const shippingTotalEl = document.querySelector('#codShippingTotal');
  const shippingMethodEl = document.querySelector('#codShippingMethod');
  const shippingBoxPriceEl = document.querySelector('#codShippingBoxPrice');
  const nombreInput = document.querySelector('#drawerNombre');
  const direccionInput = document.querySelector('#drawerDireccion');
  const referenciaInput = document.querySelector('#drawerReferencia');
  const provinciaSelect = document.querySelector('#drawerProvincia');
  const ciudadSelect = document.querySelector('#drawerCiudad');
  const dniInput = document.querySelector('#drawerDni');
  const dniField = document.querySelector('#dniField');
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
  let fullLeadTracked = false;
  let checkoutSessionId = '';
  let pendingOrderId = null;
  let trackedPurchaseId = null;
  let isSubmitting = false;

  let landingScrollY = 0;
  let checkoutOpener = null;
  const couponKey = 'marubi_organizador_coupon_until';
  const couponDuration = 15 * 60 * 1000;
  function getCouponDeadline() {
    const deadline = Date.now() + couponDuration;
    try {
      const stored = Number(sessionStorage.getItem(couponKey));
      if (stored > 0 && Number.isFinite(stored)) return stored;
      sessionStorage.setItem(couponKey, String(deadline));
    } catch { /* El temporizador sigue activo en esta página. */ }
    return deadline;
  }
  const couponDeadline = exitDiscountPopup ? getCouponDeadline() : 0;
  const clocks = document.querySelectorAll('[data-offer-clock]');
  function refreshCouponClock() {
    const seconds = Math.max(0, Math.ceil((couponDeadline - Date.now()) / 1000));
    const remaining = [Math.floor(seconds / 60), seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
    clocks.forEach(clock => { clock.textContent = remaining; });
    if (seconds) return;
    document.querySelector('#landingTimer').textContent = 'Cupón finalizado';
    if (exitDiscountPopup?.open) {
      exitDiscountPopup.close();
      submitError.textContent = 'El cupón venció. Puedes continuar con el precio de la tienda.';
      submitError.hidden = false;
      submitError.scrollIntoView({ block: 'nearest' });
    }
    window.clearInterval(couponInterval);
  }
  let couponInterval;
  if (exitDiscountPopup) {
    couponInterval = window.setInterval(refreshCouponClock, 1000);
    refreshCouponClock();
  }

  function getFormCustomerData() {
    return {
      name: nombreInput?.value?.trim() || '',
      whatsapp: whatsappInput?.value?.trim() || '',
      province: provinciaSelect?.value || '',
      city: ciudadSelect?.value || '',
    };
  }

  function syncFormUserData() {
    const data = getFormCustomerData();
    if (data.name || data.whatsapp || data.province || data.city) {
      updateMetaUserData(data);
    }
    return data;
  }

  // Poblar provincias
  Object.keys(PERU_LOCATIONS).forEach((prov) => {
    const opt = document.createElement('option');
    opt.value = prov;
    opt.textContent = prov;
    provinciaSelect.appendChild(opt);
  });

  provinciaSelect.addEventListener('change', () => {
    const prov = provinciaSelect.value;
    document.querySelector('#deliveryNote').textContent = usesShalom(prov) ? provincialDeliveryNote : '';
    dniField.hidden = !usesShalom(prov);
    dniInput.required = usesShalom(prov);
    if (!usesShalom(prov)) dniInput.value = '';
    updatePricingUI();
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
    const base = BUNDLES[qty]?.price ?? BUNDLES[1].price;
    return Math.max(0, base - exitDiscountAmount);
  }

  function updatePricingUI() {
    const active = BUNDLES[selectedQty];
    bundleCards.forEach((card) => {
      const isSel = Number(card.dataset.bundleQty) === selectedQty;
      card.classList.toggle('selected', isSel);
      card.setAttribute('aria-pressed', String(isSel));
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
      if (codDiscountRow) codDiscountRow.hidden = true;
      if (discountAppliedBanner) discountAppliedBanner.hidden = true;
    }
    const shippingFee = usesShalom(provinciaSelect.value) ? PROVINCIAL_SHIPPING_FEE : limaFee;
    if (!provinciaSelect.value && totalEl.hasAttribute('data-requires-location')) {
      shippingTotalEl.textContent = 'Selecciona tu ubicación';
      totalEl.textContent = 'Por calcular';
      return;
    }
    if (shippingTotalEl) shippingTotalEl.textContent = shippingFee ? formatSoles(shippingFee) : 'Gratis';
    if (shippingMethodEl) shippingMethodEl.textContent = shippingFee ? 'Envío por Shalom' : 'Entrega en Lima';
    if (shippingBoxPriceEl) shippingBoxPriceEl.textContent = shippingFee ? formatSoles(shippingFee) : 'Gratis';
    totalEl.textContent = formatSoles(getFinalPrice(selectedQty) + shippingFee);
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

  function ensureCheckoutSessionId() {
    if (!checkoutSessionId) {
      checkoutSessionId = `chk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }
    return checkoutSessionId;
  }

  function trackRegistrationAttempt(sourceField, forceFullSync = false) {
    const customerData = syncFormUserData();
    const active = BUNDLES[selectedQty];
    const finalPrice = getFinalPrice(selectedQty);
    const sessId = ensureCheckoutSessionId();
    const payload = {
      ...product,
      num_items: active.quantity,
      value: finalPrice,
      status: 'intento_de_registro',
      field: sourceField,
    };

    if (!registrationAttemptTracked) {
      registrationAttemptTracked = true;
      trackMetaEvent('IntentoDeRegistro', payload, {
        isCustom: true,
        eventID: `intento_${sessId}`,
        userData: customerData,
      });
    }

    const hasValidPhone = /^9\d{8}$/.test(customerData.whatsapp);
    const hasNameAndLocation =
      customerData.name.length >= 2 && Boolean(customerData.province || customerData.city);

    if ((hasValidPhone || hasNameAndLocation || forceFullSync) && !fullLeadTracked) {
      fullLeadTracked = true;
      trackMetaEvent('CompleteRegistration', payload, {
        eventID: `reg_${sessId}`,
        userData: customerData,
        keepalive: forceFullSync,
      });
      trackMetaEvent('Lead', payload, {
        eventID: `lead_${sessId}`,
        userData: customerData,
        keepalive: forceFullSync,
      });
    } else if (forceFullSync) {
      // Re-enviar con keepalive y el mismo eventID para asegurar entrega con todos los parámetros user_data
      trackMetaEvent('CompleteRegistration', payload, {
        eventID: `reg_${sessId}`,
        userData: customerData,
        keepalive: true,
      });
      trackMetaEvent('Lead', payload, {
        eventID: `lead_${sessId}`,
        userData: customerData,
        keepalive: true,
      });
    }
  }

  ['#drawerNombre', '#drawerWhatsapp', '#drawerDireccion', '#drawerReferencia', '#drawerProvincia', '#drawerCiudad'].forEach((sel) => {
    const input = document.querySelector(sel);
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.value && input.value.trim().length >= 2) {
        trackRegistrationAttempt(sel, false);
      }
    });
    input.addEventListener('change', () => {
      if (input.value && input.value.trim().length >= 1) {
        trackRegistrationAttempt(sel, false);
      }
    });
    input.addEventListener('blur', () => {
      syncFormUserData();
    });
  });

  function openCheckout(initialQty, placement = 'boton') {
    if (initialQty === 1 || initialQty === 2) {
      selectedQty = initialQty;
    }
    checkoutSessionId = `chk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    registrationAttemptTracked = false;
    fullLeadTracked = false;
    updatePricingUI();
    submitError.hidden = true;
    landingScrollY = window.scrollY;
    document.body.style.top = `-${landingScrollY}px`;
    modalOverlay.showModal();
    modalOverlay.querySelector('.cod-modal-card').scrollTop = 0;
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    const active = BUNDLES[selectedQty];
    const finalPrice = getFinalPrice(selectedQty);
    trackMetaEvent(
      'InitiateCheckout',
      {
        ...product,
        num_items: active.quantity,
        value: finalPrice,
        placement,
      },
      {
        eventID: `ic_${checkoutSessionId}`,
        userData: getFormCustomerData(),
      }
    );
  }

  function forceCloseCheckout() {
    if (exitDiscountPopup?.open) exitDiscountPopup.close();
    modalOverlay.close();
    modalOverlay.classList.remove('active');
    document.body.style.top = '';
    document.body.classList.remove('modal-open');
    window.scrollTo({ top: landingScrollY, behavior: 'instant' });
    checkoutOpener?.focus({ preventScroll: true });
    // Retain the ID across retries until the server confirms the order.
  }

  function applyExitDiscountAndStay() {
    if (Date.now() >= couponDeadline) {
      refreshCouponClock();
      return;
    }
    exitDiscountPopup.close();
    exitDiscountAmount = 5;
    updatePricingUI();
    trackMetaEvent(
      'ExitDiscountClaimed',
      {
        ...product,
        discount: 5,
        value: getFinalPrice(selectedQty),
      },
      { isCustom: true, userData: getFormCustomerData() }
    );
    nombreInput?.focus();
  }

  function handleAttemptClose() {
    if (isSubmitting) return;
    if (exitDiscountPopup && !exitDiscountOffered && Date.now() < couponDeadline) {
      exitDiscountOffered = true;
      document.querySelector('#couponTotal').textContent = formatSoles(BUNDLES[selectedQty].price - 5);
      exitDiscountPopup.showModal();
      claimDiscountBtn.focus();
      trackMetaEvent(
        'ExitDiscountOffered',
        {
          ...product,
          discount: 5,
          value: BUNDLES[selectedQty].price - 5,
        },
        { isCustom: true, userData: getFormCustomerData() }
      );
      return;
    }
    forceCloseCheckout();
  }

  claimDiscountBtn?.addEventListener('click', applyExitDiscountAndStay);
  closeExitPopupBtn?.addEventListener('click', forceCloseCheckout);
  exitDiscountPopup?.addEventListener('cancel', (event) => {
    event.preventDefault();
    forceCloseCheckout();
  });
  modalOverlay.addEventListener('cancel', (event) => {
    event.preventDefault();
    handleAttemptClose();
  });

  confirmCloseBtn?.addEventListener('click', () => {
    forceCloseCheckout();
  });

  document.querySelectorAll('[data-open-checkout]').forEach((btn) => {
    btn.addEventListener('click', () => {
      checkoutOpener = btn;
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
      if (/^9\d{8}$/.test(digits)) {
        trackRegistrationAttempt('#drawerWhatsapp', false);
      }
    }
  });

  dniInput.addEventListener('input', () => dniInput.setCustomValidity(''));

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    submitError.hidden = true;

    const nombre = nombreInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const direccion = direccionInput.value.trim();
    const referencia = referenciaInput.value.trim();
    const provincia = provinciaSelect.value;
    const ciudad = ciudadSelect.value;
    const dni = dniInput.value.trim();

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
    if (!nombre || !direccion || !referencia) {
      submitError.textContent = 'Completa tu nombre, dirección y referencia.';
      submitError.hidden = false;
      return;
    }
    const isProvincia = usesShalom(provincia);
    if (isProvincia && !/^\d{8}$/.test(dni)) {
      dniInput.setCustomValidity('Escribe un DNI válido de 8 dígitos.');
      dniInput.reportValidity();
      dniInput.focus();
      return;
    }
    dniInput.setCustomValidity('');

    const active = BUNDLES[selectedQty];
    const shippingFee = isProvincia ? PROVINCIAL_SHIPPING_FEE : limaFee;
    const finalPrice = getFinalPrice(selectedQty) + shippingFee;
    const selectedColor = getColor();
    const offerLabel = `${active.offerLabel} · Color ${selectedColor}${exitDiscountAmount > 0 ? ' + Descuento especial S/ 5' : ''}`;

    const orderNumber = pendingOrderId || createOrderId();
    pendingOrderId = orderNumber;
    const envioTexto = isProvincia
      ? provincialDeliveryNote
      : `Entrega en ${provincia} según cobertura · Envío ${formatSoles(shippingFee)}`;

    const waText =
      `¡Hola MARUBI! Acabo de realizar mi pedido en la tienda:%0A%0A` +
      `📦 *Pedido:* %23${orderNumber}%0A` +
      `🛍️ *Producto:* ${encodeURIComponent(product.content_name)}%0A` +
      `🎨 *Color:* ${encodeURIComponent(selectedColor)}%0A` +
      `🔢 *Opción:* ${encodeURIComponent(offerLabel)}%0A` +
      `💰 *Total:* ${encodeURIComponent(formatSoles(finalPrice))}%0A` +
      `🚚 *Envío:* ${encodeURIComponent(envioTexto)}%0A%0A` +
      `👤 *Nombre y Apellidos:* ${encodeURIComponent(nombre)}%0A` +
      `📱 *Celular con WhatsApp:* ${whatsapp}%0A` +
      (isProvincia ? `🪪 *DNI:* ${dni}%0A` : '') +
      `🏠 *Dirección completa:* ${encodeURIComponent(direccion)}%0A` +
      `📍 *Referencias:* ${encodeURIComponent(referencia)}%0A` +
      `🗺️ *Ubicación:* ${encodeURIComponent(ciudad)}, ${encodeURIComponent(provincia)}%0A%0A` +
      `Deseo confirmar la entrega de mi pedido. ¡Gracias!`;

    isSubmitting = true;
    submitBtn.disabled = true;
    submitText.textContent = 'Procesando Pedido…';

    // 1. Actualizar Advanced Matching con todos los parámetros del cliente (ph, fn, ln, ct, st, country, external_id)
    const customerData = {
      name: nombre,
      whatsapp,
      province: provincia,
      city: ciudad,
    };
    updateMetaUserData(customerData);

    // 2. Asegurar que CompleteRegistration y Lead se envíen con todos los datos del cliente y keepalive
    trackRegistrationAttempt('submit', true);

    try {
      await saveOrder({
        orderId: orderNumber,
        productId: product.content_ids[0],
        productName: product.content_name,
        color: selectedColor,
        offer: offerLabel,
        quantity: active.quantity,
        total: finalPrice,
        shippingFee,
        advance: isProvincia ? PROVINCIAL_ADVANCE : 0,
        dni: isProvincia ? dni : '',
        name: nombre,
        whatsapp,
        department: provincia,
        province: provincia,
        district: ciudad,
        address: direccion,
        reference: referencia,
        deliveryMethod: isProvincia ? 'shalom' : 'lima',
        place: `${ciudad}, ${provincia}`,
        pageUrl: window.location.href,
      });
    } catch {
      submitError.textContent = 'No pudimos confirmar tu pedido. Vuelve a intentarlo.';
      submitError.hidden = false;
      isSubmitting = false;
      submitBtn.disabled = false;
      submitText.textContent = 'Confirmar y enviar pedido';
      return;
    }

    if (trackedPurchaseId !== orderNumber) {
      trackedPurchaseId = orderNumber;
      const purchasePayload = {
        content_ids: product.content_ids,
        content_name: product.content_name,
        content_type: 'product',
        num_items: active.quantity,
        value: finalPrice,
        currency: 'PEN',
      };
      trackMetaEvent('Purchase', purchasePayload, {
        eventID: orderNumber,
        userData: customerData,
        keepalive: true,
      });
      trackMetaEvent(
        'OrderFormSubmitted',
        {
          ...purchasePayload,
          order_id: orderNumber,
        },
        {
          isCustom: true,
          eventID: `form_${orderNumber}`,
          userData: customerData,
          keepalive: true,
        }
      );
    }

    await new Promise((resolve) => window.setTimeout(resolve, 550));
    const whatsappUrl = `https://wa.me/51910247625?text=${waText}`;
    window.location.href = whatsappUrl;

    forceCloseCheckout();
    isSubmitting = false;
    submitBtn.disabled = false;
    submitText.textContent = 'Confirmar y enviar pedido';
    pendingOrderId = null;
    orderForm.reset();
    document.querySelector('#deliveryNote').textContent = '';
    ciudadSelect.disabled = true;
    dniField.hidden = true;
    dniInput.required = false;
    updatePricingUI();
  });
}
