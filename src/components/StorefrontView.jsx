import React, { useRef } from 'react';
import {
  BESTSELLERS_PLACEHOLDERS,
  FEATURED_COLLECTION_TWO_COL,
  MULTIROW_ITEMS,
} from '../data/templateData';
import ProductCard from './ProductCard';
import TickerBar from './TickerBar';
import WaveDivider from './WaveDivider';

export default function StorefrontView({ onOpenProduct }) {
  const trackRef = useRef(null);

  const scrollCarousel = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector('.voltra-product-card');
    const step = firstCard ? firstCard.getBoundingClientRect().width + 16 : 260;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const handleOpenTemplate = (e) => {
    e.preventDefault();
    onOpenProduct();
  };

  return (
    <main id="storefrontView" className="storefront-view">
      {/* SECCIÓN 1: HERO BANNER OFICIAL MARUBI (ADAPTATIVO COMPUTADORA Y TELÉFONO EN WEBP) */}
      <section className="voltra-hero-section" id="inicio" aria-label="Presentación de marca MARUBI Perú">
        <div className="voltra-hero-banner">
          <h1 className="sr-only">
            Somos MARUBI — Tienda Oficial en Perú (Negocio Formal RUC 10608928281): Decoración navideña, Novedades para el hogar, Regalos para todos y Variedad de productos
          </h1>
          <picture className="voltra-hero-picture">
            <source
              media="(max-width: 640px)"
              srcSet="/assets/hero-mobile-640.webp 640w, /assets/hero-mobile.webp 1024w"
              sizes="100vw"
              type="image/webp"
              width="1024"
              height="819"
            />
            <source
              media="(min-width: 641px)"
              srcSet="/assets/hero-desktop.webp"
              type="image/webp"
              width="1024"
              height="379"
            />
            <img
              src="/assets/hero-desktop.webp"
              alt="Somos MARUBI — Negocio formal RUC 10608928281: Decoración navideña, novedades para el hogar, regalos para todos y variedad de productos"
              className="voltra-hero-img"
              width="1024"
              height="379"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
        </div>
      </section>

      {/* SECCIÓN 2: COLECCIÓN DESTACADA 1 — CARRUSEL "MÁS VENDIDOS 🥇" */}
      <section className="voltra-collection-section" id="mas-vendidos" aria-labelledby="headingMasVendidos">
        <div className="page-width">
          <div className="voltra-section-title-wrap">
            <h2 id="headingMasVendidos" className="voltra-section-title">
              Más Vendidos 🥇
            </h2>
          </div>

          <div className="voltra-carousel-wrapper">
            <div className="voltra-product-track" ref={trackRef}>
              {BESTSELLERS_PLACEHOLDERS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenProduct={onOpenProduct}
                />
              ))}
            </div>

            <div className="voltra-carousel-controls">
              <button
                type="button"
                className="voltra-slider-arrow"
                onClick={() => scrollCarousel(-1)}
                aria-label="Ver productos anteriores"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                className="voltra-slider-arrow"
                onClick={() => scrollCarousel(1)}
                aria-label="Ver siguientes productos"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: MULTIROW (3 FILAS ALTERNADAS IMAGEN + CAJA OSCURA) */}
      <section className="voltra-multirow-section" aria-label="Destacados en plantilla">
        <div className="page-width voltra-multirow-list">
          {MULTIROW_ITEMS.map((row) => (
            <article
              key={row.id}
              className={`voltra-multirow-item ${row.reverse ? 'voltra-multirow-item--reverse' : ''}`}
            >
              <div className="voltra-multirow-media">
                <img
                  src={row.image}
                  alt={row.heading}
                  width="680"
                  height="510"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="voltra-multirow-content">
                <p className="voltra-multirow-caption">{row.caption}</p>
                <h2 className="voltra-multirow-heading">{row.heading}</h2>
                <p className="voltra-multirow-text">{row.text}</p>
                <a href="#producto" className="voltra-btn-outline" onClick={handleOpenTemplate}>
                  VER MÁS 👀
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECCIÓN 4: SPLIT BANNER DESTACADO */}
      <section className="voltra-split-feature" aria-label="Beneficio destacado">
        <div className="page-width voltra-split-grid">
          <div className="voltra-split-media">
            <img
              src="/assets/lifestyle-calor.webp"
              alt="Beneficios de comprar en MARUBI Perú"
              width="680"
              height="740"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="voltra-split-content">
            <h2 className="voltra-split-heading">[ Título de Beneficio Principal ✨ ]</h2>
            <div className="voltra-split-richtext">
              <p>
                [ Primer párrafo de plantilla: explica qué problema evita este producto con{' '}
                <strong>beneficios claros y directos</strong>. ]
              </p>
              <p>
                [ Segundo párrafo de plantilla: menciona su tecnología o característica diferenciadora para dar{' '}
                <strong>seguridad, precisión y comodidad</strong> donde más importa. ]
              </p>
              <p>
                [ Tercer párrafo de plantilla: destaca su facilidad de uso,{' '}
                <strong>autonomía o garantía ⚡</strong> ]
              </p>
            </div>
            <a href="#producto" className="voltra-btn-solid" onClick={handleOpenTemplate}>
              Ver más 👀
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: SEGUNDA BARRA HORIZONTAL TICKER */}
      <TickerBar ariaLabel="Beneficios de compra" />

      {/* SECCIÓN 6: COLECCIÓN DESTACADA 2 — GRILLA 2 COLUMNAS */}
      <section
        className="voltra-collection-section voltra-collection-section--two-col"
        id="coleccion-destacada"
        aria-labelledby="headingColeccionDos"
      >
        <div className="page-width">
          <div className="voltra-section-title-wrap">
            <h2 id="headingColeccionDos" className="voltra-section-title">
              [ Nombre de Colección Destacada ]
            </h2>
          </div>

          <div className="voltra-two-col-grid">
            {FEATURED_COLLECTION_TWO_COL.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenProduct={onOpenProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 7: NUESTRA MISIÓN (SPLIT INVERTIDO) */}
      <section className="voltra-split-feature voltra-split-feature--reverse" aria-label="Nuestra misión">
        <div className="page-width voltra-split-grid">
          <div className="voltra-split-media">
            <img
              src="/assets/no-ocupa-espacio-piso.webp"
              alt="Nuestra misión MARUBI Perú"
              width="680"
              height="740"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="voltra-split-content">
            <p className="voltra-mission-kicker">
              <span>🚀</span> Nuestra misión
            </p>
            <h2 className="voltra-split-heading">Tu tiempo y tu energía, donde importan.</h2>
            <div className="voltra-split-richtext">
              <p>
                [ Texto de plantilla sobre la misión de MARUBI: mantener tu casa, tu espacio de descanso o trabajo cómodo no debería implicar tiempo perdido ni complicaciones. ]
              </p>
              <p>
                Por eso seleccionamos{' '}
                <strong>soluciones multifuncionales que hacen el trabajo difícil por ti 😉</strong>
              </p>
            </div>
            <a href="#producto" className="voltra-btn-solid" onClick={handleOpenTemplate}>
              Ver más 👀
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN 8: BANNER "SOMOS MARUBI" (OVERLAP OSCURO) */}
      <section className="voltra-about-overlap" id="somos-marubi" aria-label="Somos MARUBI">
        <div className="page-width voltra-overlap-grid">
          <div className="voltra-overlap-media">
            <img
              src="/assets/hero-mobile-640.webp"
              alt="Somos MARUBI Perú"
              width="640"
              height="512"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="voltra-overlap-card">
            <h2 className="voltra-overlap-title">
              Somos <span>MARUBI</span>
            </h2>
            <p className="voltra-overlap-text">
              El <strong>Marketplace</strong> de productos que <strong>solucionan problemas</strong> que{' '}
              <strong>nadie más</strong> puede resolver.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 9: DIVISOR DE OLAS ANIMADAS HACIA EL FOOTER */}
      <WaveDivider />
    </main>
  );
}
