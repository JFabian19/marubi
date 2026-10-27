import React, { useState, useEffect, useRef } from 'react';
import { getProductPage } from '../data/templateData';
import WaveDivider from './WaveDivider';

export default function ProductTemplateView({
  selectedProduct,
  onNavigateHome,
  onOpenCheckout,
}) {
  const data = getProductPage(selectedProduct?.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState('single');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedOfferId('single');
    setOpenFaqId(null);
  }, [selectedProduct]);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < window.innerHeight * 0.35);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeOffer = data.offers?.find((offer) => offer.id === selectedOfferId);
  const displayTitle = data.title;
  const displayPrice = activeOffer?.price || data.priceCurrent;
  const displayCompare = data.priceRegular;
  const ctaLabel = activeOffer ? `Pedir ${activeOffer.label.toLowerCase()} — ${activeOffer.price}` : data.ctaLabel;
  const openCheckout = () => onOpenCheckout(activeOffer || null);

  return (
    <>
      <main id="productTemplateView" className="product-template-view">
        {/* Barra de retorno a la tienda central */}
        <div className="product-breadcrumb-bar">
          <div className="container product-breadcrumb-inner">
            <button
              type="button"
              className="btn-back-store"
              onClick={() => onNavigateHome('#inicio')}
            >
              ← Volver a la tienda MARUBI
            </button>
            <span className="breadcrumb-trail">
              Inicio / Productos / <strong>{data.breadcrumbName}</strong>
            </span>
          </div>
        </div>

        {/* Hero del Producto */}
        <section className="hero-product-section" ref={heroRef} aria-labelledby="productTitle">
          <div className="container hero-grid">
            <div className="gallery-container">
              <div className="main-image-viewport">
                <img
                  id="mainProductImg"
                  src={data.gallery[activeImageIndex]?.src}
                  alt={data.gallery[activeImageIndex]?.label || displayTitle}
                  className="main-gallery-img"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="thumbnails-row" aria-label="Vistas del producto">
                {data.gallery.map((item, idx) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`thumbnail-item ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={item.label}
                    aria-pressed={idx === activeImageIndex}
                  >
                    <img src={item.src.replace(/\.webp$/, '-thumb.webp')} alt="" loading="lazy" decoding="async" width="72" height="72" />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-info-box">
              <p className="eyebrow">{data.eyebrow}</p>
              <h1 id="productTitle">{displayTitle}</h1>
              <p className="hero-lead">{data.lead}</p>
              <p className="offer-label">{data.offers ? 'ELIGE TU PRESENTACIÓN' : 'OFERTA EXCLUSIVA'}</p>
              <div className="price-row" aria-label="Precio del producto">
                <span className="price-current">{displayPrice}</span>
                {displayCompare && <s className="price-regular">{displayCompare}</s>}
                {(activeOffer?.id === 'duo' || data.priceSave) && (
                  <span className="price-save">{activeOffer?.id === 'duo' ? activeOffer.detail : data.priceSave}</span>
                )}
              </div>
              {data.offers && (
                <fieldset className="product-offer-options">
                  <legend>Selecciona una opción</legend>
                  {data.offers.map((offer) => (
                    <label className={`product-offer-option ${selectedOfferId === offer.id ? 'selected' : ''}`} key={offer.id}>
                      <input type="radio" name="productOffer" value={offer.id} checked={selectedOfferId === offer.id} onChange={() => { setSelectedOfferId(offer.id); setActiveImageIndex(offer.id === 'duo' ? 3 : 0); }} />
                      <span><strong>{offer.label}</strong><small>{offer.detail}</small></span>
                      <b>{offer.price}</b>
                    </label>
                  ))}
                </fieldset>
              )}
              <ul className="purchase-points">
                {data.purchasePoints.map((pt, idx) => (
                  <li key={idx}>
                    <span aria-hidden="true">✓</span>
                    <strong>{pt.bold}</strong> {pt.rest}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-cta btn-cta--attention btn-open-checkout"
                onClick={openCheckout}
              >
                {ctaLabel}
              </button>
              <p className="secure-notice">
                No pagas en esta página. Confirmamos disponibilidad y entrega por WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Franja de Datos Clave */}
        <section className="proof-strip" aria-label="Información de compra">
          <div className="container proof-grid">
            {data.proofStrip.map((item, idx) => (
              <div key={idx}>
                <strong>{item.strong}</strong>
                <span>{item.span}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Qué puedes esperar */}
        <section className="expectation-section">
          <div className="container expectation-layout">
            <div className="expectation-copy">
              <p className="eyebrow">{data.expectation.eyebrow}</p>
              <h2>{data.expectation.heading}</h2>
              <p className="section-intro">{data.expectation.intro}</p>
              <div className="expectation-list">
                {data.expectation.steps.map((step) => (
                  <article key={step.num}>
                    <span className="step-number">{step.num}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <figure className="expectation-media">
              <img src={data.expectation.image} alt="Imagen demostrativa del producto" loading="lazy" />
              <figcaption>{data.expectation.caption}</figcaption>
            </figure>
          </div>
        </section>

        {/* Funciones útiles */}
        <section className="features-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">{data.features.eyebrow}</p>
              <h2>{data.features.heading}</h2>
              <p>{data.features.subtitle}</p>
            </div>
            <div className="feature-grid">
              {data.features.items.map((feat) => (
                <article key={feat.num}>
                  <span aria-hidden="true">{feat.num}</span>
                  <h3>{feat.title}</h3>
                  <p>{feat.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product-video-section" aria-labelledby="productVideosTitle">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">MIRA EL PRODUCTO EN DETALLE</p>
              <h2 id="productVideosTitle">Pronto podrás verlo en acción</h2>
              <p>{data.videoIntro || 'Estamos preparando videos reales para mostrarte cada pieza, sus diseños y cómo luce el pack en una mesa navideña.'}</p>
            </div>
            <div className="product-video-grid">
              {(data.videoLabels || ['Vista completa del pack', 'Detalles de las piezas', 'Ideas para tu mesa']).map((title, index) => (
                <div className="product-video-placeholder" key={title}>
                  <span className="video-placeholder-icon" aria-hidden="true">▶</span>
                  <strong>Video {index + 1}</strong>
                  <span>{title}</span>
                  <small>Próximamente</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ficha Técnica */}
        <section className="specs-section" id="ficha-tecnica">
          <div className="container specs-layout">
            <div>
              <p className="eyebrow">{data.specs.eyebrow}</p>
              <h2>{data.specs.heading}</h2>
              <p className="section-intro">{data.specs.intro}</p>
            </div>
            <dl className="specs-list">
              {data.specs.rows.map((row, idx) => (
                <div key={idx}>
                  <dt>{row.dt}</dt>
                  <dd>{row.dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Tarjeta de Entrega */}
        <section className="delivery-section">
          <div className="container delivery-card">
            <div>
              <p className="eyebrow">ENVÍO GRATIS A TODO EL PERÚ</p>
              <h2>{data.deliveryHeading || 'Tu pack viaja por Shalom'}</h2>
            </div>
            <div className="delivery-steps">
              <div>
                <strong>1</strong>
                <span>Completa tus datos de contacto</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Confirmamos el pedido por WhatsApp</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Coordinamos el envío gratis por Shalom</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-cta btn-cta--attention btn-open-checkout"
              onClick={openCheckout}
            >
              {ctaLabel}
            </button>
          </div>
        </section>

        {/* Preguntas Frecuentes (FAQ) */}
        <section className="faq-section">
          <div className="container faq-layout">
            <div className="section-heading left">
              <p className="eyebrow">DUDAS FRECUENTES</p>
              <h2>Compra sabiendo exactamente qué recibirás</h2>
            </div>
            <div className="faq-list">
              {data.faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <article key={faq.id} className={`faq-item ${isOpen ? 'active' : ''}`}>
                    <h3>
                      <button
                        className="faq-question"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={faq.id}
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      >
                        <span>{faq.q}</span>
                        <span className="faq-icon" aria-hidden="true">
                          +
                        </span>
                      </button>
                    </h3>
                    <div
                      className="faq-answer"
                      id={faq.id}
                      style={{ maxHeight: isOpen ? '260px' : '0px' }}
                    >
                      <p>{faq.a}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <WaveDivider />
      </main>

      {/* Barra móvil pegajosa */}
      <div
        className={`sticky-mobile-bar ${showStickyBar ? 'visible' : ''}`}
        id="stickyMobileBar"
        aria-label="Compra rápida"
      >
        <div className="sticky-price-wrap">
          <span>{displayPrice}</span>
          <small>Envío gratis</small>
        </div>
        <button
          type="button"
          className="sticky-cta-btn btn-cta--attention btn-open-checkout"
          onClick={openCheckout}
        >
          Pedir ahora
        </button>
      </div>
    </>
  );
}
