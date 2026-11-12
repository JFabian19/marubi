import React, { useState } from 'react';
import CheckoutModal from './CheckoutModal';
import './Butterfly.css';

const offers = [
  { id: 'single', label: '1 mariposa', price: 'S/ 139', value: 139, quantity: 1, detail: 'S/ 139 por unidad' },
  { id: 'duo', label: 'Pack de 2 mariposas', price: 'S/ 249', value: 249, quantity: 2, detail: 'S/ 124,50 por unidad · Ahorras S/ 29' },
  { id: 'trio', label: 'Pack de 3 mariposas', price: 'S/ 369', value: 369, quantity: 3, detail: 'S/ 123 por unidad · Ahorras S/ 48' },
];
const cookie = (name) => document.cookie.split('; ').find(x => x.startsWith(`${name}=`))?.split('=').slice(1).join('=');
function whatsapp(offer) {
  const id = crypto.randomUUID();
  const url = `https://wa.me/51910247625?text=${encodeURIComponent(`¡Hola MARUBI! Quiero consultar por la Mariposa LED navideña · ${offer.label} (${offer.price}).`)}`;
  window.open(url, '_blank', 'noopener');
  if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'Mariposa LED navideña', content_ids: ['prod-2'], content_type: 'product' }, { eventID: id });
  const endpoint = import.meta.env.VITE_META_CAPI_ENDPOINT;
  if (endpoint) fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ type: 'lead', eventId: id, pageUrl: location.href, fbp: cookie('_fbp'), fbc: cookie('_fbc'), userAgent: navigator.userAgent }) }).catch(() => {});
}
const custom = (event) => { if (typeof window.fbq === 'function') window.fbq('trackCustom', event, { content_ids: ['prod-2'] }); };

const BUTTERFLY_PRODUCT = {
  id: 'prod-2',
  slug: 'mariposa-led-navidad',
  title: 'Mariposa LED Navideña · 35 cm aprox.',
  salePrice: 'S/ 139',
  comparePrice: 'S/ 170',
  image: '/assets/mariposa/mariposa-frente-marmol-thumb.webp',
};

export default function Butterfly() {
  const [offer, setOffer] = useState(offers[0]), [open, setOpen] = useState(false);
  const openForm = () => { custom('OrderFormOpened'); setOpen(true); };
  return <div className="butterfly"><header className="bf-header"><img src="/assets/logo-marubi.webp" alt="MARUBI"/><strong>MARUBI</strong></header><main>
    <section className="bf-hero"><div className="bf-media"><img className="bf-hero-image" src="/assets/mariposa/hero-marubi.webp" alt="Mariposa LED navideña en un árbol: 35 cm de ancho aproximado, alas en movimiento, sonido y luces LED" fetchPriority="high" width="1254" height="1254" /></div>
    <div className="bf-info"><p className="bf-eyebrow">DECORACIÓN NAVIDEÑA · MARUBI</p><h1>Mariposa LED navideña <span>· 35 cm aprox.</span></h1><div className="bf-price">{offer.price}</div><p className="bf-shipping">✓ Envío gratis por Shalom</p><div className="bf-service">✦ Atención directa por WhatsApp</div><fieldset className="bf-offers"><legend>Elige tu presentación</legend>{offers.map(o => <label className={offer.id === o.id ? 'chosen' : ''} key={o.id}><img src="/assets/mariposa/mariposa-frente-marmol-thumb.webp" alt="" width="68" height="68"/><span><strong>{o.label}</strong><small>{o.detail}</small><b>{o.price}</b></span><input type="radio" name="offer" checked={offer.id === o.id} onChange={() => setOffer(o)}/></label>)}</fieldset><button className="bf-secondary" onClick={openForm}>Hacer mi pedido</button><button className="bf-whatsapp" onClick={() => whatsapp(offer)}>Consultar por WhatsApp</button><p className="bf-caption">Sin pago en línea · Adelanto solo para provincias de S/. 20</p><p className="bf-trust">Negocio formal · RUC 10608928281</p></div></section>
    <section className="bf-story"><div className="bf-story-inner"><div className="bf-story-copy"><p className="bf-story-kicker">✦ MAGIA PARA TU NAVIDAD</p><h2>Baja la luz.<br/><em>Mírala despertar.</em></h2><p>Luz blanca, alas que se mueven y música navideña para acompañar tu árbol.</p><button className="bf-story-button" onClick={openForm}>Hacer mi pedido →</button><span>Envío gratis por Shalom · Adelanto solo para provincias de S/. 20</span></div><figure><video autoPlay muted loop playsInline controls preload="metadata" poster="/assets/mariposa/mariposa-adorno-iluminado-poster.webp" aria-label="Mariposa iluminada en el árbol"><source src="/assets/mariposa/mariposa-adorno-iluminado.mp4" type="video/mp4"/>Tu navegador no puede reproducir este video.</video><figcaption>La mariposa real iluminada en el árbol</figcaption></figure></div></section>
    <section className="bf-story bf-story--second"><div className="bf-story-inner"><div className="bf-story-copy"><p className="bf-story-kicker">✦ UN DETALLE QUE COBRA VIDA</p><h2>Cuando todo se apaga,<br/><em>tu árbol sigue brillando.</em></h2><p>Sus alas translúcidas se iluminan y se mueven para darle un toque especial a tu decoración.</p><button className="bf-story-button" onClick={() => whatsapp(offer)}>Consultar por WhatsApp →</button></div><figure><video controls playsInline preload="none" poster="/assets/mariposa/mariposa-alas-movimiento-poster.webp" aria-label="Alas iluminadas en movimiento"><source src="/assets/mariposa/mariposa-alas-movimiento.mp4" type="video/mp4"/>Tu navegador no puede reproducir este video.</video><figcaption>Conoce el movimiento de sus alas</figcaption></figure></div></section>
    <section className="bf-details"><div><p className="bf-eyebrow">LO ESENCIAL ANTES DE PEDIR</p><h2>¿Qué es lo que me llegará?</h2><p>Elige una mariposa o un pack de dos o tres unidades.</p><dl><div><dt>Tamaño</dt><dd>35 cm aprox. de ancho</dd></div><div><dt>Luz y movimiento</dt><dd>Luz blanca y alas en movimiento</dd></div><div><dt>Música</dt><dd>Melodía navideña integrada</dd></div><div><dt>Alimentación</dt><dd>Eléctrica, con cable. Consulta los detalles de conexión.</dd></div><div><dt>Contenido</dt><dd>1, 2 o 3 mariposas según la presentación elegida.</dd></div><div><dt>Entrega</dt><dd>Envío gratis por Shalom; entrega en Lima a coordinar.</dd></div><div><dt>Pago</dt><dd>Adelanto solo para provincias de S/. 20; saldo al recibir.</dd></div></dl></div><figure><img src="/assets/mariposa/mariposa-pack-dos.webp" alt="Dos mariposas iluminadas en un árbol de Navidad" loading="lazy"/><figcaption>Mariposas iluminadas en el árbol</figcaption></figure></section>
    <section className="bf-bottom"><h2>¿Tienes alguna duda?</h2><p>Te ayudamos a elegir y coordinamos tu entrega por WhatsApp.</p><button className="bf-whatsapp" onClick={() => whatsapp(offer)}>Consultar por WhatsApp</button><p>MARUBI · RUC 10608928281</p></section></main><div className="bf-sticky"><span><strong>{offer.price}</strong><small>Envío gratis por Shalom</small></span><button onClick={openForm}>Hacer mi pedido</button></div><CheckoutModal isOpen={open} onClose={() => setOpen(false)} selectedProduct={BUTTERFLY_PRODUCT} selectedOffer={offer}/></div>;
}
