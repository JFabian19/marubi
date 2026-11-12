// Esta ficha usa el mismo píxel que la portada de MARUBI.
const product = {
  content_ids: ['YH1001-1A'],
  content_name: 'Organizador Metálico para Plantas de 6 Niveles MARUBI',
  content_type: 'product',
  value: 89,
  currency: 'PEN',
};

function initPixel() {
  if (!window.fbq) {
    const fbq = function (...args) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = window._fbq = fbq;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(script);
    fbq('init', '1635217208321987');
  }
  window.fbq('track', 'PageView');
  window.fbq('track', 'ViewContent', product);
}

const scenes = [
  {
    file: 'sala',
    label: 'Sala junto a la ventana',
    alt: 'Organizador metálico blanco de seis plataformas con plantas, junto a una ventana',
    srcset: '/assets/organizador-plantas/sala-movil.webp 640w, /assets/organizador-plantas/sala.webp 1122w',
  },
  {
    file: 'balcon',
    label: 'Balcón pequeño',
    alt: 'Organizador de seis plataformas con macetas en un balcón cubierto',
  },
  {
    file: 'despues',
    label: 'Rincón de jardinería interior',
    alt: 'Plantas en el organizador escalonado junto a un cuadro botánico',
  },
];

let currentScene = 0;
function showScene(step) {
  currentScene = (currentScene + step + scenes.length) % scenes.length;
  const scene = scenes[currentScene];
  const photo = document.querySelector('#hero-photo');
  if (scene.srcset) photo.srcset = scene.srcset;
  else photo.removeAttribute('srcset');
  photo.src = '/assets/organizador-plantas/' + scene.file + '.webp';
  photo.alt = scene.alt;
  document.querySelector('#gallery-caption').textContent = scene.label;
  document.querySelector('#gallery-position').textContent = (currentScene + 1) + ' / ' + scenes.length;
}
document.querySelector('#gallery-prev').addEventListener('click', () => showScene(-1));
document.querySelector('#gallery-next').addEventListener('click', () => showScene(1));

const range = document.querySelector('#compare-range');
range.addEventListener('input', () => {
  const value = range.valueAsNumber;
  document.querySelector('#comparison').style.setProperty('--split', value + '%');
  range.setAttribute('aria-valuetext', value + ' % antes y ' + (100 - value) + ' % después');
});

const menu = document.querySelector('#product-nav');
const toggle = document.querySelector('.menu-toggle');
function toggleMenu(open) {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
}
toggle.addEventListener('click', () => toggleMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', () => toggleMenu(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    toggleMenu(false);
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !toggle.contains(event.target)) toggleMenu(false);
});

initPixel();
document.querySelectorAll('a[data-contact]').forEach((link) => {
  link.addEventListener('click', () => {
    window.fbq?.('track', 'Contact', { ...product, contact_channel: 'WhatsApp', placement: link.dataset.contact });
  });
});
