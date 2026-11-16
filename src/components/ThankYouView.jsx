import React, { useState } from 'react';
import '../styles/thankYou.css';

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@marubi.pe',
    prompt: 'Síguenos y déjanos tu reseña',
    cta: 'Seguir y opinar',
    url: 'https://www.instagram.com/marubi.pe/',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id="igGrad1" cx="30%" cy="107%" r="125%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#igGrad1)" />
        <rect
          x="11"
          y="11"
          width="26"
          height="26"
          rx="7.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.8"
        />
        <circle
          cx="24"
          cy="24"
          r="6.2"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.8"
        />
        <circle cx="31.2" cy="16.8" r="1.8" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@marubi.store',
    prompt: 'Síguenos y comenta tu compra',
    cta: 'Seguir y opinar',
    url: 'https://www.tiktok.com/@marubi.store',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#000000" />
        {/* Cyan layer */}
        <path
          d="M32.4 18.2a6.9 6.9 0 0 1-4.8-5.6v-.5h-4.3v16.9a3.6 3.6 0 0 1-6.5 2.1 3.6 3.6 0 0 1 2.9-5.7c.4 0 .8.1 1.1.2v-4.4c-.4 0-.8-.1-1.2-.1a7.9 7.9 0 0 0-7.9 7.9 7.9 7.9 0 0 0 13.5 5.5 7.8 7.8 0 0 0 2.3-5.5v-8.7a10.2 10.2 0 0 0 6 1.9v-4.2c-.4 0-.8-.1-1.1-.2z"
          fill="#25F4EE"
          transform="translate(-1.35, -1.15)"
        />
        {/* Red/Magenta layer */}
        <path
          d="M32.4 18.2a6.9 6.9 0 0 1-4.8-5.6v-.5h-4.3v16.9a3.6 3.6 0 0 1-6.5 2.1 3.6 3.6 0 0 1 2.9-5.7c.4 0 .8.1 1.1.2v-4.4c-.4 0-.8-.1-1.2-.1a7.9 7.9 0 0 0-7.9 7.9 7.9 7.9 0 0 0 13.5 5.5 7.8 7.8 0 0 0 2.3-5.5v-8.7a10.2 10.2 0 0 0 6 1.9v-4.2c-.4 0-.8-.1-1.1-.2z"
          fill="#FE2C55"
          transform="translate(1.35, 1.15)"
        />
        {/* White core layer */}
        <path
          d="M32.4 18.2a6.9 6.9 0 0 1-4.8-5.6v-.5h-4.3v16.9a3.6 3.6 0 0 1-6.5 2.1 3.6 3.6 0 0 1 2.9-5.7c.4 0 .8.1 1.1.2v-4.4c-.4 0-.8-.1-1.2-.1a7.9 7.9 0 0 0-7.9 7.9 7.9 7.9 0 0 0 13.5 5.5 7.8 7.8 0 0 0 2.3-5.5v-8.7a10.2 10.2 0 0 0 6 1.9v-4.2c-.4 0-.8-.1-1.1-.2z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: '@marubi.store',
    prompt: 'Síguenos y déjanos tu reseña',
    cta: 'Seguir y opinar',
    url: 'https://www.facebook.com/marubi.store/',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#1877F2" />
        <path
          d="M29.6 48V30.8h5.77l.87-6.7h-6.64v-4.28c0-1.94.54-3.26 3.33-3.26h3.55v-6c-.61-.08-2.72-.26-5.17-.26-5.12 0-8.62 3.12-8.62 8.86v4.94h-5.79v6.7h5.79V48h6.91z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
];

const WHATSAPP_URL =
  'https://wa.me/51910247625?text=' +
  encodeURIComponent(
    '¡Hola MARUBI! 👋 Gracias por mi compra. Los agrego a WhatsApp para estar atento a las nuevas novedades de Marubí y activar mi 10% de descuento de cliente.'
  );

export default function ThankYouView({ onNavigateHome }) {
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleCopyCoupon = () => {
    const code = 'CLIENTEMARUBI10';
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2600);
  };

  const handleGoStore = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome('#inicio');
    }
  };

  return (
    <main className="ty-page" aria-labelledby="tyMainHeading">
      <div className="ty-shell">
        {/* Marca Superior Minimalista */}
        <a
          href="/inicio"
          onClick={handleGoStore}
          className="ty-brand-pill"
          aria-label="MARUBI, ir a la tienda"
        >
          <img
            src="/assets/logo-marubi.webp"
            alt="Logo MARUBI"
            width="28"
            height="28"
          />
          <span>MARUBI</span>
        </a>

        {/* Tarjeta Central */}
        <section className="ty-card">
          {/* Escenario de Animación Minimalista de Agradecimiento */}
          <div
            key={animKey}
            className="ty-anim-stage"
            onClick={() => setAnimKey((k) => k + 1)}
            title="Repetir animación"
            role="img"
            aria-label="Animación de compra confirmada con éxito"
          >
            <div className="ty-pulse-ring" />
            <div className="ty-pulse-ring ty-pulse-ring--outer" />

            {/* Partículas minimalistas */}
            <span className="ty-particle ty-particle--1" />
            <svg className="ty-particle ty-particle--2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
            </svg>
            <span className="ty-particle ty-particle--3" />
            <svg className="ty-particle ty-particle--4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
            </svg>
            <span className="ty-particle ty-particle--5" />

            <div className="ty-emblem-circle">
              <svg
                className="ty-emblem-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  className="ty-bag-path"
                  d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                />
                <line className="ty-bag-path" x1="3" y1="6" x2="21" y2="6" />
                <path className="ty-bag-path" d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <div className="ty-check-badge">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline className="ty-check-path" points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <span className="ty-eyebrow">✓ Pedido recibido con éxito</span>
          <h1 id="tyMainHeading" className="ty-title">
            ¡Gracias por tu compra!
          </h1>
          <p className="ty-subtitle">
            Gracias por confiar en <strong>MARUBI</strong>. Ya eres parte de nuestra comunidad y queremos premiar tu preferencia.
          </p>

          {/* Beneficio 10% OFF en toda la tienda por ser cliente */}
          <div className="ty-reward-box">
            <span className="ty-reward-tag">🎁 Beneficio exclusivo por ser cliente</span>
            <h2 className="ty-reward-headline">
              <span>10% de descuento</span> en toda la tienda
            </h2>
            <p className="ty-reward-desc">
              Por ser cliente de Marubí, <strong>toda compra que quieras hacer tiene un 10% de descuento en toda la tienda</strong>, sin límite de usos.
            </p>
            <div className="ty-reward-coupon">
              <div className="ty-coupon-info">
                <span className="ty-coupon-label">Tu código de cliente</span>
                <strong className="ty-coupon-code">CLIENTEMARUBI10</strong>
              </div>
              <button
                type="button"
                className={`ty-coupon-btn ${copied ? 'is-copied' : ''}`}
                onClick={handleCopyCoupon}
              >
                {copied ? '¡Copiado! ✓' : 'Copiar código'}
              </button>
            </div>
          </div>

          {/* Redes Sociales Oficiales: Follow + Reseña */}
          <div className="ty-social-section">
            <h2 className="ty-section-heading">Síguenos y déjanos tu reseña</h2>
            <p className="ty-section-sub">
              Dale <strong>follow</strong> a nuestras cuentas oficiales y cuéntanos tu experiencia con tu compra:
            </p>

            <div className="ty-social-list">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ty-social-cta ty-social-cta--${item.id}`}
                  aria-label={`${item.name} ${item.handle} - ${item.prompt}`}
                >
                  <div className="ty-social-left">
                    <div className="ty-social-logo">{item.logo}</div>
                    <div className="ty-social-texts">
                      <div className="ty-social-name-row">
                        <span className="ty-social-name">{item.name}</span>
                        <span className="ty-social-handle">{item.handle}</span>
                      </div>
                      <span className="ty-social-prompt">{item.prompt}</span>
                    </div>
                  </div>
                  <span className="ty-social-pill">
                    <span>{item.cta}</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA WhatsApp Novedades */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ty-whatsapp-cta"
          >
            <div className="ty-whatsapp-left">
              <div className="ty-whatsapp-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="#ffffff">
                  <path d="M16.01 3.2c-7.02 0-12.71 5.68-12.71 12.7 0 2.24.59 4.43 1.7 6.36L3.2 28.8l6.72-1.76a12.68 12.68 0 0 0 6.08 1.55h.01c7.01 0 12.7-5.68 12.7-12.7A12.66 12.66 0 0 0 16.01 3.2zm0 23.25h-.01a10.54 10.54 0 0 1-5.38-1.47l-.39-.23-3.99 1.05 1.07-3.89-.25-.4a10.53 10.53 0 0 1-1.62-5.62c0-5.82 4.74-10.56 10.57-10.56 2.82 0 5.47 1.1 7.46 3.1a10.48 10.48 0 0 1 3.09 7.46c0 5.83-4.74 10.56-10.55 10.56zm5.79-7.91c-.32-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.79.66.75.24 1.44.21 1.98.13.6-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.61-.37z" />
                </svg>
              </div>
              <div className="ty-whatsapp-texts">
                <span className="ty-whatsapp-title">Agréganos a WhatsApp</span>
                <span className="ty-whatsapp-sub">
                  Para que estés atento a las nuevas novedades de Marubí
                </span>
              </div>
            </div>
            <span className="ty-whatsapp-arrow" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>

          {/* Botón Ver Tienda */}
          <a
            href="/inicio"
            onClick={handleGoStore}
            className="ty-store-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Ver tienda</span>
          </a>
        </section>

        <p className="ty-foot-note">
          MARUBI Perú · Negocio Formal RUC 10608928281
        </p>
      </div>
    </main>
  );
}
