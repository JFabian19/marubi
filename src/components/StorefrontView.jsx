import React from 'react';
import { BESTSELLERS_PLACEHOLDERS } from '../data/templateData';
import ProductCard from './ProductCard';
import WaveDivider from './WaveDivider';

const grinchProduct = BESTSELLERS_PLACEHOLDERS.find((p) => p.id === 'prod-grinch');

const featuredProducts = [
  {
    id: 'prod-organizador',
    slug: 'organizador-de-plantas-6-niveles',
    title: 'Organizador metálico para plantas · 6 niveles',
    salePrice: 'S/ 79',
    comparePrice: 'S/ 129',
    discountBadge: 'OFERTA 2X S/ 144',
    image: '/assets/organizador-plantas/sala-blanco-card.webp',
    isStaticPage: true,
  },
  ...(grinchProduct ? [grinchProduct] : []),
];

export default function StorefrontView({ onOpenProduct }) {
  return (
    <main id="storefrontView" className="storefront-view">
      <section className="voltra-hero-section" id="inicio" aria-label="Presentación de MARUBI Perú">
        <div className="voltra-hero-banner">
          <h1 className="sr-only">MARUBI Perú · Productos destacados para tu hogar</h1>
          <picture className="voltra-hero-picture">
            <source media="(max-width: 640px)" srcSet="/assets/hero-mobile-640.webp 640w, /assets/hero-mobile.webp 1024w" sizes="100vw" type="image/webp" width="1024" height="819" />
            <source media="(min-width: 641px)" srcSet="/assets/hero-desktop.webp" type="image/webp" width="1024" height="379" />
            <img src="/assets/hero-desktop.webp" alt="MARUBI Perú, decoración y productos para compartir en casa" className="voltra-hero-img" width="1024" height="379" fetchPriority="high" decoding="sync" />
          </picture>
        </div>
      </section>

      <section className="voltra-collection-section home-featured-section" id="mas-vendidos" aria-labelledby="headingMasVendidos">
        <div className="page-width">
          <div className="voltra-section-title-wrap">
            <p className="eyebrow">SELECCIÓN MARUBI</p>
            <h2 id="headingMasVendidos" className="voltra-section-title">Nuestros productos destacados</h2>
            <p className="home-section-subtitle">Soluciones prácticas y detalles únicos para tu hogar, con entrega en Lima y Callao.</p>
          </div>
          <div className="home-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard product={product} onOpenProduct={onOpenProduct} key={product.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-plant-feature" aria-labelledby="homePlantTitle">
        <div className="page-width home-plant-inner">
          <img src="/assets/organizador-plantas/sala-blanco-card.webp" alt="Organizador metálico blanco de seis plataformas con plantas, junto a una ventana" width="640" height="640" loading="lazy" decoding="async" />
          <div>
            <p className="eyebrow">ORGANIZACIÓN PARA EL HOGAR</p>
            <h2 id="homePlantTitle">Más plantas, menos espacio 🌿</h2>
            <p>Organizador metálico de 6 niveles en blanco y negro, apoyado directamente en el piso.</p>
            <strong>S/ 79 · Oferta 2x S/ 144</strong>
            <a className="voltra-btn-solid" href="/producto/organizador-de-plantas-6-niveles">Ver el organizador</a>
          </div>
        </div>
      </section>
      <WaveDivider />
    </main>
  );
}
