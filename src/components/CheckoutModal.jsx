import React, { useState, useEffect, useRef } from 'react';
import { PERU_LOCATIONS } from '../data/peruLocations';
import { getProductPage } from '../data/templateData';
import { createOrderId, saveOrder } from '../lib/orders';

export default function CheckoutModal({ isOpen, onClose, selectedProduct, selectedOffer }) {
  const productData = getProductPage(selectedProduct?.id);
  const productTitle = selectedOffer ? `${productData.title} · ${selectedOffer.label}` : productData.title;
  const productPrice = selectedOffer?.price || productData.priceCurrent;
  const productValue = selectedOffer?.value || Number(selectedProduct?.salePrice?.replace(/[^\d.]/g, '')) || 0;
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const pendingOrderId = useRef(null);
  const trackedPurchaseId = useRef(null);

  const departamentos = Object.keys(PERU_LOCATIONS);
  const provincias = departamento && PERU_LOCATIONS[departamento]
    ? Object.keys(PERU_LOCATIONS[departamento])
    : [];
  const distritos =
    departamento && provincia && PERU_LOCATIONS[departamento]?.[provincia]
      ? PERU_LOCATIONS[departamento][provincia]
      : [];

  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      pendingOrderId.current = null;
      trackedPurchaseId.current = null;
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

  const handleDepartamentoChange = (e) => {
    const dept = e.target.value;
    setDepartamento(dept);
    const provs = dept && PERU_LOCATIONS[dept] ? Object.keys(PERU_LOCATIONS[dept]) : [];
    if (provs.length === 1) {
      setProvincia(provs[0]);
    } else {
      setProvincia('');
    }
    setDistrito('');
  };

  const handleProvinciaChange = (e) => {
    setProvincia(e.target.value);
    setDistrito('');
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
    if (!departamento || !provincia || !distrito) {
      alert('Por favor, selecciona Departamento, Provincia y Distrito de entrega.');
      return;
    }

    const orderNumber = pendingOrderId.current || createOrderId();
    pendingOrderId.current = orderNumber;
    const metodoTexto = 'Envío gratis a todo el Perú a través de Shalom';
    const prodTitle = productTitle;
    const prodPrice = productPrice;

    const waText =
      `¡Hola MARUBI! Acabo de registrar mi pedido en la tienda:%0A%0A` +
      `📦 *Pedido:* %23${orderNumber}%0A` +
      `👤 *Cliente:* ${encodeURIComponent(nombre.trim())}%0A` +
      `📱 *WhatsApp:* ${whatsapp}%0A` +
      `📍 *Ubicación:* ${encodeURIComponent(distrito)}, ${encodeURIComponent(provincia)}, ${encodeURIComponent(departamento)}%0A` +
      `🏠 *Dirección:* ${encodeURIComponent(direccion.trim())}%0A` +
      (referencia.trim() ? `🔍 *Referencia:* ${encodeURIComponent(referencia.trim())}%0A` : '') +
      `🚚 *Modalidad de Envío:* ${encodeURIComponent(metodoTexto)}%0A` +
      `🛍️ *Producto:* ${encodeURIComponent(prodTitle)}%0A` +
      `💰 *Total a pagar:* ${encodeURIComponent(prodPrice)}%0A%0A` +
      `Deseo confirmar la entrega de mi pedido. ¡Gracias!`;

    // Abre la pestaña durante el clic para que el bloqueador de ventanas no impida WhatsApp.
    const whatsappTab = window.open('', '_blank');
    if (whatsappTab) whatsappTab.opener = null;
    setSubmitting(true);
    try {
      await saveOrder({
        orderId: orderNumber,
        productId: selectedProduct.id,
        productName: productData.title,
        offer: selectedOffer?.label || '',
        quantity: selectedOffer?.quantity || 1,
        total: productValue,
        name: nombre.trim(),
        whatsapp,
        department: departamento,
        province: provincia,
        district: distrito,
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
    if (trackedPurchaseId.current !== orderNumber && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_ids: [selectedProduct.id],
        content_name: prodTitle,
        content_type: 'product',
        num_items: selectedOffer?.quantity || 1,
        value: productValue,
        currency: 'PEN',
      }, { eventID: orderNumber });
      trackedPurchaseId.current = orderNumber;
    }
    const whatsappUrl = `https://wa.me/51910247625?text=${waText}`;
    if (whatsappTab) whatsappTab.location.href = whatsappUrl;
    else window.location.href = whatsappUrl;
    onClose();
    pendingOrderId.current = null;
    setSubmitting(false);
    setNombre('');
    setWhatsapp('');
    setDepartamento('');
    setProvincia('');
    setDistrito('');
    setDireccion('');
    setReferencia('');
  };

  return (
    <div
      className={`checkout-drawer-overlay ${isOpen ? 'active' : ''}`}
      id="checkoutDrawerOverlay"
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="checkout-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
        <header className="drawer-header">
          <div>
            <span className="drawer-kicker">PEDIDO SIN PAGO ONLINE</span>
            <h2 id="checkoutTitle">Datos para coordinar tu entrega</h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </header>

        <div className="drawer-body">
          <div className="drawer-cart-product">
            <img src={productData.gallery[0].src} alt="" width="60" height="60" loading="lazy" decoding="async" className="drawer-product-thumb" />
            <div>
              <strong>{productTitle}</strong>
              <span>Envío gratis por Shalom</span>
            </div>
            <strong className="drawer-product-price">{productPrice}</strong>
          </div>

          <form id="drawerOrderForm" onSubmit={handleSubmit}>
            <div className="drawer-form-grid">
              <div className="drawer-form-group full">
                <label htmlFor="drawerNombre">Nombre y apellido</label>
                <div className="field-control">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="drawerNombre"
                    placeholder="Escribe tu nombre"
                    required
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
              </div>

              <div className="drawer-form-group full">
                <label htmlFor="drawerWhatsapp">WhatsApp</label>
                <div className={`field-control ${whatsappError ? 'is-invalid' : ''}`}>
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0 11.9 11.9 0 0 0 1.8 17.8L.1 24l6.4-1.7A12 12 0 0 0 24 11.9c0-3.2-1.2-6.2-3.5-8.4ZM12.1 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.3-.4A9.8 9.8 0 1 1 12 21.8Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2 2.2.9 3.1 1 4.2.8.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.4-.2-.7-.4Z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    id="drawerWhatsapp"
                    placeholder="9XXXXXXXX"
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

              <div className="drawer-form-group">
                <label htmlFor="drawerDepartamento">Departamento</label>
                <div className="field-control">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
                    </svg>
                  </span>
                  <select
                    id="drawerDepartamento"
                    required
                    value={departamento}
                    onChange={handleDepartamentoChange}
                  >
                    <option value="" disabled>
                      Selecciona
                    </option>
                    {departamentos.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="drawer-form-group">
                <label htmlFor="drawerProvincia">Provincia</label>
                <div className="field-control">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
                    </svg>
                  </span>
                  <select
                    id="drawerProvincia"
                    disabled={!departamento}
                    required
                    value={provincia}
                    onChange={handleProvinciaChange}
                  >
                    <option value="" disabled>
                      {departamento ? 'Selecciona provincia' : 'Selecciona departamento'}
                    </option>
                    {provincias.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="drawer-form-group full">
                <label htmlFor="drawerDistrito">Distrito</label>
                <div className="field-control">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
                    </svg>
                  </span>
                  <select
                    id="drawerDistrito"
                    disabled={!provincia}
                    required
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                  >
                    <option value="" disabled>
                      {provincia ? 'Selecciona distrito' : 'Selecciona provincia'}
                    </option>
                    {distritos.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="drawer-form-group full">
                <label htmlFor="drawerDireccion">Dirección completa</label>
                <div className="field-control">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m12 2 9 8h-3v10h-5v-6h-2v6H6V10H3l9-8Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="drawerDireccion"
                    placeholder="Calle, número, urbanización"
                    required
                    autoComplete="street-address"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>
              </div>

              <div className="drawer-form-group full">
                <label htmlFor="drawerReferencia">
                  Referencia <span>(opcional)</span>
                </label>
                <div className="field-control">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="drawerReferencia"
                    placeholder="Ej. frente a un parque"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="shipping-label">Forma de entrega</div>
            <div className="shipping-cost-card selected">
              {departamento ? (
                <input
                  type="radio"
                  name="shippingMethod"
                  checked
                  readOnly
                  className="shipping-cost-radio"
                />
              ) : null}
              <div className="shipping-cost-text">
                <div className="shipping-cost-title">Envío gratis por Shalom</div>
                <div className="shipping-cost-desc">
                  {!departamento
                    ? 'Selecciona tu ubicación para coordinar el despacho'
                    : 'Coordinaremos entrega o recojo por WhatsApp'}
                </div>
              </div>
            </div>
          </form>
        </div>

        <footer className="drawer-footer">
          <div>
            <span>Total</span>
            <strong>{productPrice}</strong>
          </div>
          <button type="submit" form="drawerOrderForm" id="drawerSubmitBtn" disabled={submitting}>
            {submitting ? 'Registrando pedido…' : 'Realizar pedido'}
          </button>
          {submitError && <small className="order-submit-error" role="alert">{submitError}</small>}
          <small>Al continuar, registraremos tu pedido y abrirás WhatsApp para confirmarlo.</small>
        </footer>
      </section>
    </div>
  );
}
