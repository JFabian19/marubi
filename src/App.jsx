import React, { useState, useEffect } from 'react';
import TickerBar from './components/TickerBar';
import Header from './components/Header';
import StorefrontView from './components/StorefrontView';
import ProductTemplateView from './components/ProductTemplateView';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import { BESTSELLERS_PLACEHOLDERS, getProductPage } from './data/templateData';

const STOREFRONT_TITLE =
  'Decoración navideña y packs especiales | MARUBI Perú';

const productFromLocation = () => BESTSELLERS_PLACEHOLDERS.find(
  (product) => window.location.pathname.replace(/\/$/, '') === `/producto/${product.slug}`
    || window.location.hash === `#producto/${product.slug}`
);

export default function App() {
  const [currentView, setCurrentView] = useState(() =>
    productFromLocation() ? 'product' : 'storefront'
  );
  const [selectedProduct, setSelectedProduct] = useState(() => productFromLocation() || BESTSELLERS_PLACEHOLDERS[0]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('product-view-active', currentView === 'product');
    if (currentView === 'product') {
      const prodTitle = getProductPage(selectedProduct?.id).title;
      document.title = `${prodTitle} | MARUBI Perú`;
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_ids: [selectedProduct.id],
          content_name: selectedProduct.title,
          content_type: 'product',
          value: Number(selectedProduct.salePrice?.replace(/[^\d.]/g, '')) || 0,
          currency: 'PEN',
        });
      }
    } else {
      document.title = STOREFRONT_TITLE;
    }
  }, [currentView, selectedProduct]);

  useEffect(() => {
    if (window.location.hash.startsWith('#producto/')) {
      const legacyProduct = productFromLocation();
      if (legacyProduct) {
        window.history.replaceState(null, '', `/producto/${legacyProduct.slug}`);
      }
    } else if (['#inicio', '#home', '#mas-vendidos', '#somos-marubi'].includes(window.location.hash)) {
      const section = window.location.hash;
      window.history.replaceState(null, '', '/inicio');
      if (section !== '#inicio' && section !== '#home') {
        requestAnimationFrame(() => document.querySelector(section)?.scrollIntoView());
      }
    }
    const handlePopState = () => {
      const product = productFromLocation();
      if (product) {
        setSelectedProduct(product);
        setCurrentView('product');
      } else {
        setCurrentView('storefront');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenProduct = (product = BESTSELLERS_PLACEHOLDERS[0]) => {
    setSelectedProduct(product);
    setSelectedOffer(null);
    setCurrentView('product');
    const productUrl = `/producto/${product.slug}`;
    if (`${window.location.pathname}${window.location.hash}` !== productUrl) {
      window.history.pushState(null, '', productUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (targetHash = '#inicio') => {
    setCurrentView('storefront');
    const sectionHash = targetHash && targetHash !== '#inicio' && targetHash !== '#' ? targetHash : '';
    const homeUrl = '/inicio';
    if (`${window.location.pathname}${window.location.hash}` !== homeUrl) {
      window.history.pushState(null, '', homeUrl);
    }
    if (sectionHash) {
      setTimeout(() => {
        const el = document.querySelector(sectionHash);
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

  const handleOpenCheckout = (offer = null) => {
    setSelectedOffer(offer);
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: [selectedProduct.id],
        content_name: selectedProduct.title,
        content_type: 'product',
        num_items: offer?.quantity || 1,
        value: offer?.value || Number(selectedProduct.salePrice?.replace(/[^\d.]/g, '')) || 0,
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
        onOpenProduct={handleOpenProduct}
      />

      {currentView === 'storefront' ? (
        <StorefrontView onOpenProduct={handleOpenProduct} onNavigateHome={handleNavigateHome} />
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
        selectedOffer={selectedOffer}
      />
    </>
  );
}
