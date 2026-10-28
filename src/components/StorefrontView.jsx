import React from 'react';
import { BESTSELLERS_PLACEHOLDERS } from '../data/templateData';
import ProductCard from './ProductCard';
import WaveDivider from './WaveDivider';

const featuredProducts = BESTSELLERS_PLACEHOLDERS.slice(0, 2);

const stories = [
  {
    product: featuredProducts[0],
    image: '/assets/navidad/pack-navidad-15-piezas.webp',
    eyebrow: 'PARA COMPARTIR',
    title: 'La mesa lista para Navidad',
    text: '15 piezas para vestir la mesa: platos dorados, bowls con orejitas, plato de árbol y tazas Merry Christmas.',
    offer: 'Oferta exclusiva S/ 169.90',
  },
  {
    product: featuredProducts[1],
    image: '/assets/mariposa/mariposa-perfil-marmol.webp',
    eyebrow: 'PARA ILUMINAR',
    title: 'Una mariposa que hace brillar el árbol',
    text: 'Alas translúcidas, luz blanca y música navideña incluida en una figura de 35 cm aprox. Disponible por unidad o en packs de dos y tres.',
    offer: '1 por S/ 139 · 2 por S/ 249 · 3 por S/ 369',
  },
];

export default function StorefrontView({ onOpenProduct, onNavigateHome }) {
  const openProduct = (product) => (event) => {
    event.preventDefault();
    onOpenProduct(product);
  };

  return (
    <main id="storefrontView" className="storefront-view">
      <section className="voltra-hero-section" id="inicio" aria-label="Presentación de MARUBI Perú">
        <div className="voltra-hero-banner">
          <h1 className="sr-only">MARUBI Perú · Ideas para celebrar Navidad</h1>
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
            <h2 id="headingMasVendidos" className="voltra-section-title">Nuestros favoritos de Navidad ✨</h2>
            <p className="home-section-subtitle">Elige la mesa que invita a compartir o el detalle que hace brillar tu árbol.</p>
          </div>
          <div className="home-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard product={product} onOpenProduct={onOpenProduct} key={product.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-stories-section" aria-labelledby="storiesTitle">
        <div className="page-width">
          <div className="section-heading">
            <p className="eyebrow">DOS FORMAS DE CELEBRAR</p>
            <h2 id="storiesTitle">Pequeños detalles, grandes momentos</h2>
          </div>
          <div className="home-story-grid">
            {stories.map((story) => (
              <article className="home-story-card" key={story.product.id}>
                <img src={story.image} alt={story.product.title} loading="lazy" width="1024" height="1024" />
                <div>
                  <p className="eyebrow">{story.eyebrow}</p>
                  <h3>{story.title}</h3>
                  <p>{story.text}</p>
                  <strong>{story.offer}</strong>
                  <a href={`/producto/${story.product.slug}`} className="voltra-btn-solid" onClick={openProduct(story.product)}>Ver producto</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-shipping-section" aria-label="Envío de tus pedidos">
        <div className="page-width home-shipping-inner">
          <div>
            <p className="eyebrow">COMPRA EN MARUBI</p>
            <h2>Navidad en casa, estés donde estés</h2>
            <p>Envío gratis a todo el Perú a través de Shalom. Elige tu producto y coordinaremos tu pedido por WhatsApp.</p>
          </div>
          <a href="/inicio" className="voltra-btn-solid" onClick={(event) => { event.preventDefault(); onNavigateHome('#mas-vendidos'); }}>Ver los favoritos</a>
        </div>
      </section>
      <WaveDivider />
    </main>
  );
}
