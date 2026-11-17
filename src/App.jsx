import React, { useState, useEffect, useRef } from 'react';
import Butterfly from './components/Butterfly';
import TickerBar from './components/TickerBar';
import Header from './components/Header';
import StorefrontView from './components/StorefrontView';
import ProductTemplateView from './components/ProductTemplateView';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import ThankYouView from './components/ThankYouView';
import { BESTSELLERS_PLACEHOLDERS, getProductPage } from './data/templateData';
import { trackMetaEvent, sendKeepalivePixelBeacon } from './lib/metaPixel';

const STOREFRONT_TITLE =
  'Decoración navideña y packs especiales | MARUBI Perú';
const THANKYOU_TITLE =
  '¡Gracias por tu compra! | MARUBI Perú';

const isThankYouFromLocation = () => {
  const cleanPath = window.location.pathname.replace(/\/$/, '');
  return (
    cleanPath === '/graciasportucompra' ||
    cleanPath === '/gracias-por-tu-compra' ||
    window.location.hash === '#graciasportucompra' ||
    window.location.hash === '#gracias-por-tu-compra'
  );
};

const productFromLocation = () => BESTSELLERS_PLACEHOLDERS.find(
  (product) => window.location.pathname.replace(/\/$/, '') === `/producto/${product.slug}`
    || window.location.hash === `#producto/${product.slug}`
);

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (isThankYouFromLocation()) return 'thankyou';
    return productFromLocation() ? 'product' : 'storefront';
  });
  const [selectedProduct, setSelectedProduct] = useState(() => productFromLocation() || BESTSELLERS_PLACEHOLDERS[0]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const initialPageViewHandled = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (typeof window.fbq?.callMethod !== 'function' && window.__marubiPageViewId) {
        sendKeepalivePixelBeacon('PageView', {}, window.__marubiPageViewId);
      }
    }, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('product-view-active', currentView === 'product');
    document.body.classList.toggle('grinch-page-active', currentView === 'product' && selectedProduct?.id === 'prod-grinch');
    if (currentView === 'thankyou') {
      document.title = THANKYOU_TITLE;
    } else if (currentView === 'product') {
      const prodTitle = getProductPage(selectedProduct?.id).title;
      document.title = `${prodTitle} | MARUBI Perú`;
    } else {
      document.title = STOREFRONT_TITLE;
    }

    if (!initialPageViewHandled.current) {
      initialPageViewHandled.current = true;
    } else {
      trackMetaEvent('PageView');
    }
  }, [currentView, selectedProduct]);

  useEffect(() => {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    if (
      cleanPath === '/gracias-por-tu-compra' ||
      window.location.hash === '#graciasportucompra' ||
      window.location.hash === '#gracias-por-tu-compra'
    ) {
      window.history.replaceState(null, '', '/graciasportucompra');
    } else if (window.location.hash.startsWith('#producto/')) {
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
      if (isThankYouFromLocation()) {
        setCurrentView('thankyou');
        return;
      }
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

  const handleOpenCheckout = (offer = null, placement = 'boton_abrir_formulario') => {
    setSelectedOffer(offer);
    const prodData = getProductPage(selectedProduct?.id);
    const activeOffer = offer || prodData.offers?.[0] || null;
    const value =
      activeOffer?.value ||
      Number(prodData.priceCurrent?.replace(/[^\d.]/g, '')) ||
      Number(selectedProduct?.salePrice?.replace(/[^\d.]/g, '')) ||
      0;
    const quantity = activeOffer?.quantity || 1;
    trackMetaEvent('InitiateCheckout', {
      content_ids: [selectedProduct.id],
      content_name: prodData.title || selectedProduct.title,
      content_type: 'product',
      num_items: quantity,
      value,
      currency: 'PEN',
      placement,
    });
    setCheckoutOpen(true);
  };

  if (currentView === 'thankyou') {
    return <ThankYouView onNavigateHome={handleNavigateHome} />;
  }

  if (currentView === 'product' && selectedProduct?.id === 'prod-2') return <Butterfly />;

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
