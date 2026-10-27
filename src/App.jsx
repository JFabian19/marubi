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

const productFromHash = () => BESTSELLERS_PLACEHOLDERS.find(
  (product) => window.location.hash === `#producto/${product.slug}`
) || BESTSELLERS_PLACEHOLDERS[0];

export default function App() {
  const [currentView, setCurrentView] = useState(() =>
    window.location.hash.startsWith('#producto') ? 'product' : 'storefront'
  );
  const [selectedProduct, setSelectedProduct] = useState(productFromHash);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('product-view-active', currentView === 'product');
    if (currentView === 'product') {
      const prodTitle = getProductPage(selectedProduct?.id).title;
      document.title = `${prodTitle} | MARUBI Perú`;
    } else {
      document.title = STOREFRONT_TITLE;
    }
  }, [currentView, selectedProduct]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash.startsWith('#producto')) {
        setSelectedProduct(productFromHash());
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
    const hash = `#producto/${product.slug}`;
    const productUrl = `/${hash}`;
    if (`${window.location.pathname}${window.location.hash}` !== productUrl) {
      window.history.pushState(null, '', productUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = (targetHash = '#inicio') => {
    setCurrentView('storefront');
    const sectionHash = targetHash && targetHash !== '#inicio' && targetHash !== '#' ? targetHash : '';
    const homeUrl = `/inicio${sectionHash}`;
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
        content_name: getProductPage(selectedProduct?.id).title,
        value: offer?.value || (selectedProduct?.id === 'prod-2' ? 149.9 : 169.9),
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
        selectedOffer={selectedOffer}
      />
    </>
  );
}
