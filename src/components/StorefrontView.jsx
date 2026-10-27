import React from 'react';
import { BESTSELLERS_PLACEHOLDERS } from '../data/templateData';
import ProductCard from './ProductCard';
import WaveDivider from './WaveDivider';

const featuredProduct = BESTSELLERS_PLACEHOLDERS[0];

const highlights = [
  { image: '/assets/navidad/platos-dorados.jpg', title: '6 platos dorados', text: 'De polipropileno, con diseños para vestir tu mesa.' },
  { image: '/assets/navidad/bowl-rojo.jpg', title: '2 bowls con orejitas', text: 'De cerámica, con detalles navideños rojo y verde.' },
  { image: '/assets/navidad/plato-arbol.jpg', title: '1 plato de árbol', text: 'Una pieza especial para servir o decorar.' },
  { image: '/assets/navidad/taza-verde.jpg', title: '6 tazas Merry Christmas', text: 'Tazas redondas con diseños festivos.' },
];

export default function StorefrontView({ onOpenProduct }) {
  const openFeatured = (event) => {
    event.preventDefault();
    onOpenProduct(featuredProduct);
  };

  return (
    <main id="storefrontView" className="storefront-view">
      <section className="voltra-hero-section" id="inicio" aria-label="Presentación de MARUBI Perú">
        <div className="voltra-hero-banner">
          <h1 className="sr-only">MARUBI Perú · Pack Navideño de Mesa de 15 piezas</h1>
          <picture className="voltra-hero-picture">
            <source media="(max-width: 640px)" srcSet="/assets/hero-mobile-640.webp 640w, /assets/hero-mobile.webp 1024w" sizes="100vw" type="image/webp" width="1024" height="819" />
            <source media="(min-width: 641px)" srcSet="/assets/hero-desktop.webp" type="image/webp" width="1024" height="379" />
            <img src="/assets/hero-desktop.webp" alt="MARUBI Perú, productos para compartir en casa" className="voltra-hero-img" width="1024" height="379" fetchPriority="high" decoding="sync" />
          </picture>
        </div>
      </section>

      <section className="voltra-collection-section home-featured-section" id="mas-vendidos" aria-labelledby="headingMasVendidos">
        <div className="page-width">
          <div className="voltra-section-title-wrap">
            <h2 id="headingMasVendidos" className="voltra-section-title">Nuestro producto estrella ✨</h2>
          </div>
          <div className="home-featured-grid">
            <ProductCard product={featuredProduct} onOpenProduct={onOpenProduct} />
            <div className="home-featured-copy">
              <p className="eyebrow">OFERTA EXCLUSIVA DE NAVIDAD</p>
              <h2>Una mesa para celebrar juntos</h2>
              <p>Platos dorados, bowls con orejitas, un plato en forma de árbol y tazas Merry Christmas. Todo el pack de 15 piezas por <strong>S/ 169.90</strong>.</p>
              <p className="home-price-line"><s>S/ 209.90</s> <strong>S/ 169.90</strong> <span>Ahorras S/ 40.00</span></p>
              <p className="home-shipping-note">Envío gratis a todo el Perú a través de Shalom.</p>
              <a href="#producto" className="voltra-btn-solid" onClick={openFeatured}>Ver pack y pedir ahora</a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-highlights-section" aria-labelledby="homeHighlightsTitle">
        <div className="page-width">
          <div className="section-heading">
            <p className="eyebrow">CONOCE TU PACK</p>
            <h2 id="homeHighlightsTitle">Cuatro tipos de piezas, una sola celebración</h2>
          </div>
          <div className="home-highlights-grid">
            {highlights.map((item) => (
              <article className="home-highlight-card" key={item.title}>
                <img src={item.image} alt={item.title} loading="lazy" width="1200" height="1200" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="home-highlights-action">
            <a href="#producto" className="voltra-btn-solid" onClick={openFeatured}>Descubrir el pack completo</a>
          </div>
        </div>
      </section>

      <section className="home-shipping-section" aria-label="Envío de tu pack">
        <div className="page-width home-shipping-inner">
          <div>
            <p className="eyebrow">COMPRA EN MARUBI</p>
            <h2>Navidad en tu mesa, estés donde estés</h2>
            <p>El envío del pack es gratis a todo el Perú a través de Shalom. Confirma tus datos y coordinaremos tu pedido por WhatsApp.</p>
          </div>
          <a href="#producto" className="voltra-btn-solid" onClick={openFeatured}>Pedir por S/ 169.90</a>
        </div>
      </section>
      <WaveDivider />
    </main>
  );
}
