import React, { useState, useEffect } from 'react';
import TickerBar from './components/TickerBar';
import Header from './components/Header';
import StorefrontView from './components/StorefrontView';
import ProductTemplateView from './components/ProductTemplateView';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import { PRODUCT_PAGE_TEMPLATE } from './data/templateData';

const STOREFRONT_TITLE =
  'Pack Navideño de Mesa · 15 piezas por S/ 169.90 | MARUBI Perú';

export default function App() {
  const [currentView, setCurrentView] = useState(() =>
    window.location.hash === '#producto' ? 'product' : 'storefront'
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('product-view-active', currentView === 'product');
    if (currentView === 'product') {
      const prodTitle = selectedProduct?.title || PRODUCT_PAGE_TEMPLATE.title;
      document.title = `${prodTitle} | MARUBI Perú`;
    } else {
      document.title = STOREFRONT_TITLE;
    }
  }, [currentView, selectedProduct]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash === '#producto') {
        setCurrentView('product');
      } else {
        setCurrentView('storefront');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenProduct = (product = null) => {
    setSelectedProduct(product);
    setCurrentView('product');
    if (window.location.hash !== '#producto') {
      window.history.pushState(null, '', '#producto');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (targetHash = '#inicio') => {
    setCurrentView('storefront');
    window.history.pushState(null, '', targetHash);
    if (targetHash && targetHash !== '#inicio' && targetHash !== '#') {
      setTimeout(() => {
        const el = document.querySelector(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenCheckout = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: selectedProduct?.title || PRODUCT_PAGE_TEMPLATE.title,
        value: 169.9,
        currency: 'PEN',
      });
    }
    setCheckoutOpen(true);
  };

  return (
    <>
      <TickerBar ariaLabel="Promociones destacadas" />
      <Header
        onNavigateHome={handleNavigateHome}
        onOpenProduct={() => handleOpenProduct(null)}
      />

      {currentView === 'storefront' ? (
        <StorefrontView onOpenProduct={handleOpenProduct} />
      ) : (
        <ProductTemplateView
          selectedProduct={selectedProduct}
          onNavigateHome={handleNavigateHome}
          onOpenCheckout={handleOpenCheckout}
        />
      )}

      <Footer onNavigateHome={handleNavigateHome} />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        selectedProduct={selectedProduct}
      />
    </>
  );
}
