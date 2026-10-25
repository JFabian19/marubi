import React, { useState } from 'react';

export default function Footer({ onNavigateHome }) {
  const [email, setEmail] = useState('');

  const handleHomeClick = (e, hash = '#inicio') => {
    e.preventDefault();
    onNavigateHome(hash);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('¡Gracias por suscribirte a MARUBI!');
    setEmail('');
  };

  return (
    <div className="voltra-footer-group" id="footer-ayuda">
      {/* Sello Superior de Negocio Formal (equivalente al Data Fiscal de Voltra) */}
      <div className="voltra-footer-seal">
        <a
          href="#inicio"
          onClick={(e) => handleHomeClick(e, '#inicio')}
          className="voltra-fiscal-badge"
          aria-label="MARUBI Negocio Formal Registrado RUC 10608928281"
        >
          <img
            src="/assets/logo-marubi.webp"
            alt="MARUBI Perú Tienda Formal"
            width="52"
            height="52"
            loading="lazy"
            decoding="async"
          />
          <div className="voltra-fiscal-badge__text">
            <span className="fiscal-kicker">✓ NEGOCIO 100% FORMAL Y VERIFICADO</span>
            <strong>RUC: 10608928281</strong>
            <small>Razón Social: Harry Fabián Tafur Urbina</small>
          </div>
        </a>
      </div>

      <footer className="voltra-footer">
        <div className="page-width voltra-footer__top">
          <div className="voltra-footer__grid">
            {/* Bloque 1: Información de Marca + Respaldo Legal */}
            <div className="voltra-footer__brand-block">
              <div className="voltra-footer__logo-wrap">
                <img
                  src="/assets/logo-marubi.webp"
                  alt="Logo MARUBI Perú"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                />
                <span>MARUBI</span>
              </div>
              <h2 className="voltra-footer__tagline">
                <strong>MARUBI®</strong> — Diseño. Potencia. Innovación.
              </h2>
              <p className="voltra-footer__description">
                MARUBI® está conformado por un equipo comprometido a brindar acceso a soluciones prácticas y premium para el día a día, con foco en calidad, durabilidad y una experiencia de compra en línea superior en todo el Perú.
              </p>
              <div className="voltra-footer__legal-card">
                <p>
                  <strong>Somos un negocio formal en el Perú:</strong> operamos con{' '}
                  <strong>RUC 10608928281</strong> y razón social a nombre de{' '}
                  <strong>Harry Fabián Tafur Urbina</strong>. Todas tus compras cuentan con garantía real y atención directa.
                </p>
              </div>
            </div>

            {/* Bloque 2: NEWSLETTER */}
            <div className="voltra-footer__col">
              <h3 className="voltra-footer__heading">NEWSLETTER</h3>
              <form className="voltra-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="voltra-newsletter-field">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    required
                    aria-label="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" aria-label="Suscribirse">
                    →
                  </button>
                </div>
              </form>
            </div>

            {/* Bloque 3: AYUDA */}
            <div className="voltra-footer__col">
              <h3 className="voltra-footer__heading">AYUDA</h3>
              <ul className="voltra-footer__links">
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Cómo comprar</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Medios de pago</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>¿Cómo son los envíos?</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Garantía y devoluciones</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Contacto</a></li>
                <li><a href="#somos-marubi" onClick={(e) => handleHomeClick(e, '#somos-marubi')}>Comprar en MARUBI</a></li>
              </ul>
            </div>

            {/* Bloque 4: NUESTRAS POLÍTICAS */}
            <div className="voltra-footer__col">
              <h3 className="voltra-footer__heading">NUESTRAS POLÍTICAS</h3>
              <ul className="voltra-footer__links">
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Política de envíos</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Política de devoluciones</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Política de privacidad</a></li>
                <li><a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>Condiciones de servicio</a></li>
              </ul>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="voltra-footer__social-row">
            <ul className="voltra-social-list" aria-label="Redes sociales">
              <li>
                <a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')} aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')} aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')} aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Parte inferior del Footer */}
        <div className="page-width voltra-footer__bottom">
          <div className="voltra-payment-icons" aria-label="Formas de pago">
            <span className="payment-pill">VISA</span>
            <span className="payment-pill">MASTERCARD</span>
            <span className="payment-pill">AMEX</span>
            <span className="payment-pill">YAPE / PLIN</span>
            <span className="payment-pill">PAGO CONTRA ENTREGA</span>
          </div>
          <div className="voltra-copyright">
            <small>
              &copy; 2026,{' '}
              <a href="#inicio" onClick={(e) => handleHomeClick(e, '#inicio')}>
                MARUBI Perú
              </a>{' '}
              · Negocio Formal <strong>RUC 10608928281</strong> — Razón Social:{' '}
              <strong>Harry Fabián Tafur Urbina</strong>
            </small>
          </div>
        </div>
      </footer>
    </div>
  );
}
