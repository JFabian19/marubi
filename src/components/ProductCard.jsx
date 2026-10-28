import React from 'react';

export default function ProductCard({ product, onOpenProduct }) {
  const handleClick = (e) => {
    e.preventDefault();
    onOpenProduct(product);
  };

  return (
    <article className="voltra-product-card">
      <a href={`/producto/${product.slug}`} className="voltra-card-link" onClick={handleClick}>
        <div className="voltra-card-media">
          {product.image ? (
            <img src={product.image} alt={product.title} loading="lazy" />
          ) : (
            <div className="voltra-card-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
              <span>{product.placeholderLabel || 'Imagen del Producto'}</span>
            </div>
          )}
          {product.discountBadge && (
            <span className="voltra-discount-badge">{product.discountBadge}</span>
          )}
        </div>
        <div className="voltra-card-content">
          <h3 className="voltra-card-title">{product.title}</h3>
          <div className="voltra-card-price">
            <span className="voltra-price-sale">{product.salePrice}</span>
            {product.comparePrice && (
              <s className="voltra-price-compare">{product.comparePrice}</s>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}
