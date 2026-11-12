import React, { useState, useEffect, useRef } from 'react';
import { PERU_LOCATIONS } from '../data/peruLocations';
import { getProductPage } from '../data/templateData';
import { createOrderId, saveOrder } from '../lib/orders';

function formatSoles(amount) {
  return `S/. ${Number(amount || 0).toFixed(2)}`;
}

function getBundleOptions(selectedProduct, productData) {
  const baseValue =
    Number(selectedProduct?.salePrice?.replace(/[^\d.]/g, '')) ||
    Number(productData?.priceCurrent?.replace(/[^\d.]/g, '')) ||
    130;

  const offer1 = productData?.offers?.find((o) => o.quantity === 1);
  const offer2 = productData?.offers?.find((o) => o.quantity === 2);
  const offer3 = productData?.offers?.find((o) => o.quantity === 3);

  const p1 = offer1?.value || baseValue;
  const old2 = p1 * 2;
  const p2 = offer2?.value || (p1 === 130 ? 210 : Math.round((old2 * 0.82) / 10) * 10);
  const old3 = p1 * 3;
  const p3 = offer3?.value || (p1 === 130 ? 350 : Math.round((old3 * 0.88) / 10) * 10);

  return [
    {
      quantity: 1,
      title: '1 unidad',
      badgeText: 'Envio Gratis',
      badgeType: 'blue',
      price: p1,
      oldPrice: null,
      offerLabel: '1 unidad (Envio Gratis)',
    },
    {
      quantity: 2,
      title: '2 Unidades',
      badgeText: 'Mas regalo\nsorpresa',
      badgeType: 'green',
      price: p2,
      oldPrice: old2,
      offerLabel: '2 Unidades (Mas regalo sorpresa)',
    },
    {
      quantity: 3,
      title: '3 Unidades',
      badgeText: 'Mas 2 regalos\nsorpresa',
      badgeType: 'green',
      price: p3,
      oldPrice: old3,
      offerLabel: '3 Unidades (Mas 2 regalos sorpresa)',
    },
  ];
}

export default function CheckoutModal({ isOpen, onClose, selectedProduct, selectedOffer }) {
  const productData = getProductPage(selectedProduct?.id);
  const productThumb =
    selectedProduct?.image ||
    productData?.gallery?.[0]?.src ||
    '/assets/mariposa/mariposa-frente-marmol.webp';

  const bundles = getBundleOptions(selectedProduct, productData);
  const [selectedQty, setSelectedQty] = useState(selectedOffer?.quantity || 1);

  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const pendingOrderId = useRef(null);

  const provinciasList = Object.keys(PERU_LOCATIONS);
  const ciudadesList =
    provincia && PERU_LOCATIONS[provincia]
      ? Array.from(new Set(Object.values(PERU_LOCATIONS[provincia]).flat()))
      : [];

  useEffect(() => {
    if (isOpen) {
      setSelectedQty(selectedOffer?.quantity || 1);
    }
  }, [isOpen, selectedOffer?.quantity, selectedProduct?.id]);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      pendingOrderId.current = null;
      setSubmitError('');
    }
  }, [isOpen, selectedProduct?.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeBundle = bundles.find((b) => b.quantity === selectedQty) || bundles[0];

  const handleProvinciaSelect = (e) => {
    setProvincia(e.target.value);
    setCiudad('');
  };

  const handleWhatsappChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    setWhatsapp(digits);
    if (digits && !/^9\d{8}$/.test(digits)) {
      setWhatsappError('Escribe 9 dígitos y empieza con 9.');
    } else {
      setWhatsappError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError('');

    if (!/^9\d{8}$/.test(whatsapp)) {
      setWhatsappError('Escribe 9 dígitos y empieza con 9.');
      return;
    }
    if (!provincia || !ciudad) {
      alert('Por favor, selecciona Provincia y Ciudad.');
      return;
    }

    const orderNumber = pendingOrderId.current || createOrderId();
    pendingOrderId.current = orderNumber;
    const isProvincia = provincia !== 'Lima' && provincia !== 'Callao';
    const envioTexto = isProvincia
      ? 'Envío Gratis (Adelanto solo para provincias de S/. 20)'
      : 'Envío Gratis (Pago al Recibir)';

    const waText =
      `¡Hola MARUBI! Acabo de realizar mi pedido en la tienda:%0A%0A` +
      `📦 *Pedido:* %23${orderNumber}%0A` +
      `🛍️ *Producto:* ${encodeURIComponent(productData.title)}%0A` +
      `🔢 *Opción:* ${encodeURIComponent(activeBundle.offerLabel)}%0A` +
      `💰 *Total:* ${encodeURIComponent(formatSoles(activeBundle.price))}%0A` +
      `🚚 *Envío:* ${encodeURIComponent(envioTexto)}%0A%0A` +
      `👤 *Nombre y Apellidos:* ${encodeURIComponent(nombre.trim())}%0A` +
      `📱 *Celular con WhatsApp:* ${whatsapp}%0A` +
      `🏠 *Dirección completa:* ${encodeURIComponent(direccion.trim())}%0A` +
      `📍 *Referencias:* ${encodeURIComponent(referencia.trim())}%0A` +
      `🗺️ *Ubicación:* ${encodeURIComponent(ciudad)}, ${encodeURIComponent(provincia)}%0A%0A` +
      `Deseo confirmar la entrega de mi pedido. ¡Gracias!`;

    const whatsappTab = window.open('', '_blank');
    if (whatsappTab) whatsappTab.opener = null;
    setSubmitting(true);

    try {
      await saveOrder({
        orderId: orderNumber,
        productId: selectedProduct?.id || 'prod-1',
        productName: productData.title,
        offer: activeBundle.offerLabel,
        quantity: activeBundle.quantity,
        total: activeBundle.price,
        name: nombre.trim(),
        whatsapp,
        department: provincia,
        province: provincia,
        district: ciudad,
        address: direccion.trim(),
        reference: referencia.trim(),
        pageUrl: window.location.href,
      });
    } catch (error) {
      whatsappTab?.close();
      setSubmitError('No pudimos registrar tu pedido. Inténtalo otra vez; tus datos siguen aquí.');
      setSubmitting(false);
      return;
    }

    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', 'OrderFormSubmitted', {
        content_ids: [selectedProduct?.id || 'prod-1'],
        value: activeBundle.price,
        currency: 'PEN',
      });
    }

    const whatsappUrl = `https://wa.me/51910247625?text=${waText}`;
    if (whatsappTab) whatsappTab.location.href = whatsappUrl;
    else window.location.href = whatsappUrl;

    onClose();
    pendingOrderId.current = null;
    setSubmitting(false);
    setNombre('');
    setWhatsapp('');
    setDireccion('');
    setReferencia('');
    setProvincia('');
    setCiudad('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="cod-modal-overlay active"
      id="checkoutDrawerOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="Formulario de pedido"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="cod-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="cod-close-btn"
          onClick={onClose}
          aria-label="Cerrar formulario"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="cod-modal-body">
          {/* 1. Opciones de envío */}
          <h3 className="cod-section-title">Opciones de envío</h3>
          <div className="cod-shipping-box">
            <div className="cod-shipping-left">
              <div className="cod-radio-selected" aria-hidden="true">
                <div className="cod-radio-dot" />
              </div>
              <div className="cod-shipping-texts">
                <div className="cod-shipping-main">Envio Gratis</div>
                <div className="cod-shipping-sub">Adelanto solo para provincias de S/. 20</div>
              </div>
            </div>
            <div className="cod-shipping-price">Gratis</div>
          </div>

          {/* 2. Paquetes de 1, 2 y 3 Unidades */}
          <div className="cod-bundles-list">
            {bundles.map((b) => {
              const isSelected = b.quantity === activeBundle.quantity;
              return (
                <div
                  key={b.quantity}
                  className={`cod-bundle-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedQty(b.quantity)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedQty(b.quantity);
                    }
                  }}
                >
                  <div className="cod-bundle-left">
                    <img
                      src={productThumb}
                      alt={productData.title}
                      className="cod-bundle-img"
                      width="60"
                      height="60"
                    />
                    <div className="cod-bundle-info">
                      <div className="cod-bundle-title">{b.title}</div>
                      {b.badgeType === 'blue' ? (
                        <span className="cod-badge-blue">{b.badgeText}</span>
                      ) : (
                        <span className="cod-badge-green">
                          {b.badgeText.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <br />}
                              {line}
                            </React.Fragment>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="cod-bundle-right">
                    {b.oldPrice && (
                      <span className="cod-bundle-old-price">{formatSoles(b.oldPrice)}</span>
                    )}
                    <span className="cod-bundle-price">{formatSoles(b.price)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Resumen Subtotal / Envío / Total */}
          <div className="cod-summary-box">
            <div className="cod-summary-row">
              <span>Subtotal</span>
              <strong>{formatSoles(activeBundle.price)}</strong>
            </div>
            <div className="cod-summary-row">
              <span>Envío</span>
              <strong>Gratis</strong>
            </div>
            <div className="cod-summary-divider" />
            <div className="cod-summary-row cod-summary-total">
              <span>Total</span>
              <strong>{formatSoles(activeBundle.price)}</strong>
            </div>
          </div>

          {/* 4. Formulario con los mismos iconos y campos */}
          <form id="drawerOrderForm" className="cod-form" onSubmit={handleSubmit}>
            {/* Nombre y Apellidos* */}
            <div className="cod-field">
              <label htmlFor="drawerNombre" className="cod-label">
                Nombre y Apellidos<span className="cod-req">*</span>
              </label>
              <div className="cod-input-group">
                <div className="cod-input-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9.5" stroke="#111111" strokeWidth="1.8" />
                    <circle cx="12" cy="9.5" r="3" fill="#111111" />
                    <path d="M6.8 18.2C7.9 15.8 9.8 14.5 12 14.5C14.2 14.5 16.1 15.8 17.2 18.2" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="drawerNombre"
                  placeholder="Nombre completo"
                  required
                  autoComplete="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>

            {/* Celular con Whatsapp* */}
            <div className="cod-field">
              <label htmlFor="drawerWhatsapp" className="cod-label">
                Celular con Whatsapp<span className="cod-req">*</span>
              </label>
              <div className={`cod-input-group ${whatsappError ? 'is-invalid' : ''}`}>
                <div className="cod-input-icon" aria-hidden="true">
                  <img src="/assets/whatsapp-icon.png" alt="" width="22" height="22" className="cod-wa-png" />
                </div>
                <input
                  type="tel"
                  id="drawerWhatsapp"
                  placeholder="Celular con Whatsapp"
                  minLength={9}
                  maxLength={9}
                  pattern="9[0-9]{8}"
                  inputMode="numeric"
                  required
                  autoComplete="tel"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                />
              </div>
              {whatsappError && (
                <p className="field-error" role="alert">
                  {whatsappError}
                </p>
              )}
            </div>

            {/* Dirección completa* */}
            <div className="cod-field">
              <label htmlFor="drawerDireccion" className="cod-label">
                Dirección completa<span className="cod-req">*</span>
              </label>
              <div className="cod-input-group">
                <div className="cod-input-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5C4.5 14.88 12 22 12 22C12 22 19.5 14.88 19.5 9.5C19.5 5.36 16.14 2 12 2ZM12 12.25C10.48 12.25 9.25 11.02 9.25 9.5C9.25 7.98 10.48 6.75 12 6.75C13.52 6.75 14.75 7.98 14.75 9.5C14.75 11.02 13.52 12.25 12 12.25Z" fill="#111111" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="drawerDireccion"
                  placeholder="Ej: Av. Arequipa 123, Dpto 402, Ur"
                  required
                  autoComplete="street-address"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
            </div>

            {/* Referencias de la dirección* */}
            <div className="cod-field">
              <label htmlFor="drawerReferencia" className="cod-label">
                Referencias de la dirección<span className="cod-req">*</span>
              </label>
              <div className="cod-input-group">
                <div className="cod-input-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C7.86 2 4.5 5.36 4.5 9.5C4.5 14.88 12 22 12 22C12 22 19.5 14.88 19.5 9.5C19.5 5.36 16.14 2 12 2ZM12 12.25C10.48 12.25 9.25 11.02 9.25 9.5C9.25 7.98 10.48 6.75 12 6.75C13.52 6.75 14.75 7.98 14.75 9.5C14.75 11.02 13.52 12.25 12 12.25Z" fill="#111111" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="drawerReferencia"
                  placeholder="Ej: Entre las calles, Por el.., frente"
                  required
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </div>
            </div>

            {/* Provincia* */}
            <div className="cod-field">
              <label htmlFor="drawerProvincia" className="cod-label">
                Provincia<span className="cod-req">*</span>
              </label>
              <div className="cod-select-wrap">
                <select
                  id="drawerProvincia"
                  required
                  value={provincia}
                  onChange={handleProvinciaSelect}
                >
                  <option value="" disabled>
                    Provincia
                  </option>
                  {provinciasList.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                <span className="cod-select-chevron" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Ciudad* */}
            <div className="cod-field">
              <label htmlFor="drawerCiudad" className="cod-label">
                Ciudad<span className="cod-req">*</span>
              </label>
              <div className="cod-select-wrap">
                <select
                  id="drawerCiudad"
                  required
                  disabled={!provincia}
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                >
                  <option value="" disabled>
                    Ciudad
                  </option>
                  {ciudadesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="cod-select-chevron" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {submitError && (
              <p className="field-error" role="alert">
                {submitError}
              </p>
            )}

            {/* Botón Amarillo Inclinado */}
            <div className="cod-submit-wrap">
              <button type="submit" className="cod-submit-btn" id="drawerSubmitBtn" disabled={submitting}>
                <svg className="cod-cart-check-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                  <path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3h10.2a1.5 1.5 0 0 0 1.5-1.2L21.5 6H5.2" />
                  <polyline points="10.5 10.5 12.5 12.5 16 9" />
                </svg>
                <span>{submitting ? 'Registrando pedido…' : 'Realizar Pedido y Pagar al Recibir'}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
