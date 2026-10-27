import React, { useState, useEffect } from 'react';
import { BESTSELLERS_PLACEHOLDERS } from '../data/templateData';

export default function Header({ onNavigateHome, onOpenProduct }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({ productos: true, faq: false });

  const closeAll = () => {
    setMenuOpen(false);
    setCartOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const isAnyModalOpen = menuOpen || cartOpen;
    document.body.classList.toggle('modal-open', isAnyModalOpen);
    return () => document.body.classList.remove('modal-open');
  }, [menuOpen, cartOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHomeNav = (e, targetHash = '#inicio') => {
    e.preventDefault();
    closeAll();
    onNavigateHome(targetHash);
  };

  const handleProductNav = (e, product) => {
    e.preventDefault();
    closeAll();
    onOpenProduct(product);
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="page-width header-inner">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => {
              closeAll();
              setMenuOpen(true);
            }}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="menuDrawer"
          >
            <span className="icon-hamburger" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <a
            href="#inicio"
            className="brand-logo"
            onClick={(e) => handleHomeNav(e, '#inicio')}
            aria-label="MARUBI, ir al inicio"
          >
            <img src="/assets/logo-marubi.webp" alt="Logo MARUBI" width="38" height="38" className="brand-logo-img" />
            <span>MARUBI</span>
          </a>

          <div className="header-actions">
            <button
              type="button"
              className="header-icon-btn"
              onClick={() => {
                setMenuOpen(false);
                setCartOpen(false);
                setSearchOpen((prev) => !prev);
              }}
              aria-label="Búsqueda"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="20" y1="20" x2="16.35" y2="16.35"></line>
              </svg>
            </button>

            <a
              href="#inicio"
              onClick={(e) => handleHomeNav(e, '#inicio')}
              className="header-icon-btn small-hide"
              aria-label="Cuenta"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </a>

            <button
              type="button"
              className="header-icon-btn cart-trigger-btn"
              onClick={() => {
                closeAll();
                setCartOpen(true);
              }}
              aria-label="Abrir carrito"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-count-badge">0</span>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="search-modal" id="searchModal">
            <div className="page-width search-modal__inner">
              <form className="search-modal__form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="search"
                  className="search-modal__input"
                  placeholder="Buscar productos en MARUBI..."
                  aria-label="Buscar productos"
                  autoFocus
                />
                <button type="submit" className="search-modal__submit" aria-label="Buscar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"></circle>
                    <line x1="20" y1="20" x2="16.35" y2="16.35"></line>
                  </svg>
                </button>
              </form>
              <button
                type="button"
                className="search-modal__close"
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Drawer Menú Lateral */}
      <div
        className={`side-drawer-overlay ${menuOpen ? 'active' : ''}`}
        aria-hidden={!menuOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAll();
        }}
      >
        <aside className="side-drawer side-drawer--left" id="menuDrawer" role="dialog" aria-modal="true" aria-label="Menú principal">
          <div className="side-drawer__header">
            <span className="side-drawer__title">Menú</span>
            <button type="button" className="side-drawer__close" onClick={closeAll} aria-label="Cerrar menú">
              ×
            </button>
          </div>
          <nav className="side-drawer__body">
            <ul className="drawer-nav-list">
              <li>
                <a href="#inicio" onClick={(e) => handleHomeNav(e, '#inicio')} className="drawer-nav-link">
                  Home
                </a>
              </li>
              <li className="drawer-nav-group">
                <button
                  type="button"
                  className="drawer-nav-link drawer-nav-toggle"
                  aria-expanded={openSubmenus.productos}
                  onClick={() => toggleSubmenu('productos')}
                >
                  <span>Productos</span>
                  <span className="drawer-chevron">▾</span>
                </button>
                {openSubmenus.productos && (
                  <ul className="drawer-sublist">
                    <li><a href="#mas-vendidos" onClick={(e) => handleHomeNav(e, '#mas-vendidos')}>Favoritos de Navidad</a></li>
                    {BESTSELLERS_PLACEHOLDERS.slice(0, 2).map((product) => (
                      <li key={product.id}><a href={`#producto/${product.slug}`} onClick={(e) => handleProductNav(e, product)}>{product.title}</a></li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="drawer-nav-group">
                <button
                  type="button"
                  className="drawer-nav-link drawer-nav-toggle"
                  aria-expanded={openSubmenus.faq}
                  onClick={() => toggleSubmenu('faq')}
                >
                  <span>Preguntas Frecuentes</span>
                  <span className="drawer-chevron">▾</span>
                </button>
                {openSubmenus.faq && (
                  <ul className="drawer-sublist">
                    <li><a href="#somos-marubi" onClick={(e) => handleHomeNav(e, '#somos-marubi')}>¿Quiénes somos?</a></li>
                    <li><a href="#footer-ayuda" onClick={closeAll}>Cómo comprar</a></li>
                    <li><a href="#footer-ayuda" onClick={closeAll}>Medios de pago</a></li>
                    <li><a href="#footer-ayuda" onClick={closeAll}>¿Cómo son los envíos?</a></li>
                    <li><a href="#footer-ayuda" onClick={closeAll}>Garantía y devoluciones</a></li>
                  </ul>
                )}
              </li>
              <li>
                <a href="#footer-ayuda" onClick={closeAll} className="drawer-nav-link">
                  Contacto
                </a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      {/* Drawer Carrito Lateral */}
      <div
        className={`side-drawer-overlay ${cartOpen ? 'active' : ''}`}
        aria-hidden={!cartOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAll();
        }}
      >
        <aside className="side-drawer side-drawer--right" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Tu carrito">
          <div className="side-drawer__header">
            <span className="side-drawer__title">Carrito • 0</span>
            <button type="button" className="side-drawer__close" onClick={closeAll} aria-label="Cerrar carrito">
              ×
            </button>
          </div>
          <div className="side-drawer__body cart-drawer-empty">
            <div className="cart-empty-box">
              <h3>Tu carrito está vacío</h3>
              <a
                href="#mas-vendidos"
                className="btn-solid-primary"
                onClick={(e) => handleHomeNav(e, '#mas-vendidos')}
              >
                Seguir comprando
              </a>
            </div>
            <div className="cart-collection-promo">
              <div className="cart-collection-card">
                <div className="cart-collection-media">
                  <img src="/assets/navidad/pack-navidad-15-piezas.jpg" alt="Pack Navideño MARUBI de 15 piezas" width="1200" height="1200" loading="lazy" decoding="async" />
                </div>
                <div className="cart-collection-info">
                  <h4>
                    <a href="#mas-vendidos" onClick={(e) => handleHomeNav(e, '#mas-vendidos')}>
                      Pack Navideño →
                    </a>
                  </h4>
                  <p>15 piezas para celebrar: S/ 169.90 y envío gratis a todo el Perú por Shalom.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
