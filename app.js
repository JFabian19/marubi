/* ==========================================================================
   MARUBI — E-Commerce Storefront Engine
   State Management, Shopping Cart, WhatsApp Orders & Modals
   ========================================================================== */

// 1. Updated Product Catalog Data (Exclusively the 5 requested products)
const PRODUCTS = [
  {
    id: "amoladora-kit",
    title: "Mini Amoladora Inalámbrica 48V + 2 Baterías y Kit Completo",
    subtitle: "Corte y desbaste de precisión con maletín y pack de 5 discos",
    category: "electricas",
    categoryLabel: "Herramientas Eléctricas",
    price: 119,
    originalPrice: 169,
    discountBadge: "PRODUCTO PRINCIPAL -30%",
    image: "assets/products/amoladora-kit.jpg",
    description: "Mini amoladora angular portátil de alto rendimiento para cortes precisos en metal, tuberías, madera, plástico y cerámicos. Incluye maletín de transporte rígido BULLTOOLS de alto impacto, 2 baterías de litio 48V recargables, cargador rápido, 2 discos abrasivos de corte y blíster de 3 mini discos de sierra especiales para madera y multiuso.",
    specs: [
      "Potencia y agilidad para corte, pulido y desbaste en espacios reducidos",
      "Incluye 2 Baterías de litio 48V de larga autonomía y carga rápida",
      "Maletín rígido BULLTOOLS resistente a golpes y caídas",
      "Juego completo de 5 discos: 2 de corte abrasivo + blíster de 3 mini discos sierra (madera, volante, multiuso)",
      "Llave Allen de ajuste y bloqueo seguro de eje",
      "Garantía oficial MARUBI con soporte directo en todo el Perú"
    ]
  },
  {
    id: "taladro-percutor-kit",
    title: "Taladro Percutor Inalámbrico 180V con 2 Baterías y Kit Completo",
    subtitle: "2 Baterías de Litio 4.0Ah, cargador rápido, juego de brocas y maletín",
    category: "electricas",
    categoryLabel: "Herramientas Eléctricas",
    price: 130,
    originalPrice: 179,
    discountBadge: "OFERTA -27%",
    image: "assets/products/taladro-percutor-kit.jpg",
    description: "Taladro percutor inalámbrico reversible con selector de 25 niveles de torque y velocidad variable. Equipado con 2 baterías de litio XR 4.0Ah para perforar mampostería, concreto, fierro y madera sin cables ni interrupciones.",
    specs: [
      "Triple función: Taladro / Atornillador / Percutor de alto impacto",
      "2 Baterías de litio XR 4.0Ah con indicador de carga integrado",
      "Mandril de 10mm (3/8\") metálico de ajuste rápido sin llave",
      "Maletín organizador con juego de brocas para concreto y metal, puntas y dados hexagonales",
      "Extensión flexible para atornillar en ángulos y rincones difíciles",
      "Luz LED de trabajo para máxima visibilidad en áreas oscuras"
    ]
  },
  {
    id: "taladro-maletin-pro",
    title: "Taladro Percutor Inalámbrico 180V + Kit Profesional de Herramientas",
    subtitle: "Estuche completo con martillo, alicates, llaves, sierra y 2 baterías",
    category: "electricas",
    categoryLabel: "Herramientas Eléctricas",
    price: 180,
    originalPrice: 249,
    discountBadge: "KIT COMPLETO",
    image: "assets/products/taladro-maletin-pro.jpg",
    description: "El set maestro indispensable para proyectos del hogar y taller profesional: potente taladro percutor de 180V con 2 baterías de litio 20V 2.0Ah, integrado en un maletín industrial XIOQUI con todas las herramientas manuales esenciales de uso rudo.",
    specs: [
      "Taladro percutor inalámbrico con selector de percusión y 18 niveles de torque",
      "2 Baterías de litio recargables de 20V 2.0Ah + cargador de pared",
      "Martillo sacaclavos de acero forjado con mango ergonómico",
      "Llave ajustable (francesa), alicate universal y alicate de punta fina",
      "Arco de sierra para metales, wincha métrica de 3m con freno y cúter reforzado",
      "Buscapolo digital, cinta aislante y caja con surtido de tarugos y tornillos"
    ]
  },
  {
    id: "destornilladores-115en1",
    title: "Kit de Destornilladores de Precisión 115 en 1",
    subtitle: "Acero cromo-vanadio para celulares, consolas, relojes y laptops",
    category: "manuales",
    categoryLabel: "Herramientas Manuales",
    price: 99,
    originalPrice: 139,
    discountBadge: "TOP PRECISIÓN",
    image: "assets/products/destornilladores-115en1.jpg",
    description: "Kit profesional multiherramienta de 115 piezas en estuche compacto de doble vista. Cuenta con 98 puntas magnéticas de aleación Cr-V para reparación de celulares (iPhone, Samsung, Xiaomi), laptops, tablets, lentes, relojes y mandos de consolas.",
    specs: [
      "98 puntas de precisión magnetizadas resistentes al desgaste (Torx, Phillips, Pentalobe, Tri-wing, Hex)",
      "Mango ergonómico antideslizante con extensión telescópica de acero",
      "Eje de extensión flexible para tornillos ocultos",
      "Púas de apertura plásticas, pinzas de precisión antiestáticas y ventosa de pantalla",
      "Herramienta magnetizadora / desmagnetizadora y extractor de bandeja SIM"
    ]
  },
  {
    id: "sopladora-turbo",
    title: "Sopladora Turbo Inalámbrica 35,000 Pa – Violent Fan JH-801",
    subtitle: "Motor sin escobillas ultra potente para autos, limpieza de PC y exteriores",
    category: "electricas",
    categoryLabel: "Herramientas Eléctricas",
    price: 69,
    originalPrice: 109,
    discountBadge: "OFERTA FLASH",
    image: "assets/products/sopladora-turbo.jpg",
    description: "Sopladora turbina inalámbrica con tecnología Violent Fan de 35,000 Pa de presión de aire. Ideal para secado rápido de pintura y carrocerías de autos, limpieza de componentes electrónicos, eliminación de polvo en computadoras, encendido de carbón y soplado de hojas.",
    specs: [
      "Presión de flujo extremo: 35,000 Pa (tecnología Violent Fan)",
      "Batería recargable de alta capacidad con cargador incluido",
      "Boquilla aerodinámica concentradora para máxima velocidad de viento",
      "Gatillo ergonómico con respuesta instantánea de potencia",
      "Diseño ultra compacto y portátil para operar con una sola mano"
    ]
  }
];

// 2. Shopping Cart Initial State (Starts with the main product: Amoladora)
let cart = [
  { productId: "amoladora-kit", quantity: 1 }
];

// Try reading saved cart from localStorage if present
try {
  const savedCart = localStorage.getItem("marubi_cart");
  if (savedCart) {
    const parsed = JSON.parse(savedCart);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Validate that saved items exist in our current product catalog
      const valid = parsed.filter(item => PRODUCTS.some(p => p.id === item.productId));
      if (valid.length > 0) {
        cart = valid;
      }
    }
  }
} catch (e) {
  console.warn("Storage not available:", e);
}

function saveCart() {
  try {
    localStorage.setItem("marubi_cart", JSON.stringify(cart));
  } catch (e) {}
}

// 3. Cart DOM Elements & Updating Logic
const cartBadges = document.querySelectorAll(".cart-badge, .bottom-cart-badge");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTotalEl = document.getElementById("cartTotal");
const toastNotice = document.getElementById("toastNotice");

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Update header and bottom navigation badges
  cartBadges.forEach(badge => {
    badge.textContent = totalCount;
    badge.classList.remove("pop");
    void badge.offsetWidth; // trigger reflow
    badge.classList.add("pop");
  });

  // Render items in drawer
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h3>Tu bolsa está vacía</h3>
        <p>Explora nuestras herramientas y añade tus favoritas.</p>
      </div>
    `;
    cartSubtotalEl.textContent = "S/ 0";
    cartTotalEl.textContent = "S/ 0";
    return;
  }

  let subtotal = 0;
  let itemsHTML = "";

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return;
    
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    itemsHTML += `
      <div class="cart-item" data-id="${product.id}">
        <div class="cart-item-img-box">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="cart-item-details">
          <div>
            <h4 class="cart-item-title">${product.title}</h4>
            <div class="cart-item-price">S/ ${lineTotal}</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="changeQuantity('${product.id}', -1)" aria-label="Disminuir">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQuantity('${product.id}', 1)" aria-label="Aumentar">+</button>
            </div>
            <button class="cart-item-delete" onclick="removeFromCart('${product.id}')" title="Eliminar producto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = itemsHTML;
  cartSubtotalEl.textContent = `S/ ${subtotal}`;
  cartTotalEl.textContent = `S/ ${subtotal}`;
}

function addToCart(productId, qty = 1) {
  const existing = cart.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ productId, quantity: qty });
  }
  saveCart();
  updateCartUI();
  
  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`✓ Añadido a la bolsa: ${product ? product.title : 'Herramienta'}`);
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.productId !== productId);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.productId !== productId);
  saveCart();
  updateCartUI();
}

function openCart() {
  cartOverlay.classList.add("open");
  cartDrawer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay.classList.remove("open");
  cartDrawer.classList.remove("open");
  document.body.style.overflow = "";
}

// 4. Toast Notification
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastNotice.querySelector(".toast-text").textContent = message;
  toastNotice.classList.add("show");
  toastTimeout = setTimeout(() => {
    toastNotice.classList.remove("show");
  }, 2600);
}

// 5. Product Quick View Modal Logic
const productModal = document.getElementById("productModal");
let currentModalProductId = null;
let currentModalQuantity = 1;

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;
  currentModalQuantity = 1;

  document.getElementById("modalImg").src = product.image;
  document.getElementById("modalImg").alt = product.title;
  document.getElementById("modalBadge").textContent = product.discountBadge || product.categoryLabel;
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalPrice").textContent = `S/ ${product.price}`;
  document.getElementById("modalOldPrice").textContent = product.originalPrice ? `S/ ${product.originalPrice}` : "";

  // Render specs list
  const specsList = document.getElementById("modalSpecsList");
  specsList.innerHTML = product.specs.map(spec => `
    <li class="modal-feature-item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${spec}</span>
    </li>
  `).join("");

  productModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  productModal.classList.remove("open");
  document.body.style.overflow = "";
}

function addModalProductToCart() {
  if (currentModalProductId) {
    addToCart(currentModalProductId, currentModalQuantity);
    closeProductModal();
    openCart();
  }
}

function buyModalProductDirectWA() {
  const product = PRODUCTS.find(p => p.id === currentModalProductId);
  if (!product) return;

  const text = encodeURIComponent(
    `Hola MARUBI, deseo comprar directamente:\n\n` +
    `• 1x ${product.title} - S/ ${product.price}\n\n` +
    `¿Tienen stock y despacho para hoy? Mi distrito / ciudad es: `
  );
  window.open(`https://wa.me/51987654321?text=${text}`, "_blank");
}

// 6. WhatsApp Complete Cart Order
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Tu bolsa de compras está vacía.");
    return;
  }

  let text = "Hola MARUBI, deseo confirmar mi pedido desde la tienda web:\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      const lineTotal = product.price * item.quantity;
      total += lineTotal;
      text += `${index + 1}. ${product.title} (x${item.quantity}) — S/ ${lineTotal}\n`;
    }
  });

  text += `\n*TOTAL A PAGAR:* S/ ${total}\n*ENVÍO:* ¡Gratis a todo el Perú!\n\n`;
  text += `Por favor envíenme los datos de pago (Yape / Plin / BCP / BBVA) y el formulario de envío a mi dirección.`;

  window.open(`https://wa.me/51987654321?text=${encodeURIComponent(text)}`, "_blank");
}

// 7. Simulated Checkout & Payment Modal
const checkoutModal = document.getElementById("checkoutModal");

function openCheckoutModal() {
  closeCart();
  let total = 0;
  cart.forEach(item => {
    const p = PRODUCTS.find(prod => prod.id === item.productId);
    if (p) total += p.price * item.quantity;
  });
  document.getElementById("checkoutTotalSummary").textContent = `S/ ${total}`;
  checkoutModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("open");
  document.body.style.overflow = "";
}

function selectPaymentMethod(cardEl, method) {
  document.querySelectorAll(".payment-method-card").forEach(el => el.classList.remove("active"));
  cardEl.classList.add("active");
  const detailsEl = document.getElementById("paymentMethodDetails");
  
  if (method === 'yape') {
    detailsEl.innerHTML = `
      <div style="background: #fdf2f8; border: 1px solid #f472b6; border-radius: 8px; padding: 12px; margin-top: 10px; font-size: 13px; color: #831843;">
        <strong>Paga con Yape o Plin al número oficial:</strong><br>
        Número: <strong>987 654 321</strong> (MARUBI PERÚ S.A.C.)<br>
        Envía tu captura por WhatsApp para confirmación inmediata de tu despacho.
      </div>
    `;
  } else if (method === 'card') {
    detailsEl.innerHTML = `
      <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
        <input type="text" placeholder="Número de Tarjeta (Visa, Mastercard, Amex)" style="height: 40px; padding: 0 10px; border: 1px solid #d1d5db; border-radius: 8px;">
        <div style="display: flex; gap: 8px;">
          <input type="text" placeholder="MM/AA" style="flex: 1; height: 40px; padding: 0 10px; border: 1px solid #d1d5db; border-radius: 8px;">
          <input type="text" placeholder="CVV" style="width: 80px; height: 40px; padding: 0 10px; border: 1px solid #d1d5db; border-radius: 8px;">
        </div>
      </div>
    `;
  } else {
    detailsEl.innerHTML = `
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 12px; margin-top: 10px; font-size: 13px; color: #14532d;">
        <strong>Pago Contra Entrega disponible en Lima Metropolitana:</strong><br>
        Pagas en efectivo o con POS al recibir tu paquete en tu domicilio.
      </div>
    `;
  }
}

function confirmOrderSimulated(e) {
  e.preventDefault();
  const name = document.getElementById("orderCustName").value;
  const phone = document.getElementById("orderCustPhone").value;
  const address = document.getElementById("orderCustAddress").value;

  alert(`¡Gracias por tu compra, ${name}!\n\nTu pedido #MRB-${Math.floor(10000 + Math.random() * 90000)} ha sido registrado exitosamente.\nTe enviaremos los datos de seguimiento a tu WhatsApp: ${phone}.\nDirección de despacho: ${address}`);
  
  cart = [];
  saveCart();
  updateCartUI();
  closeCheckoutModal();
}

// 8. Order Tracking & Profile Modal
const trackingModal = document.getElementById("trackingModal");

function openTrackingModal() {
  trackingModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeTrackingModal() {
  trackingModal.classList.remove("open");
  document.body.style.overflow = "";
}

function lookupOrderTracking(e) {
  e.preventDefault();
  const code = document.getElementById("trackingCodeInput").value.trim();
  const resultBox = document.getElementById("trackingResultBox");

  resultBox.innerHTML = `
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-top: 14px; text-align: left;">
      <div style="font-size: 14px; font-weight: 800; color: #166534; margin-bottom: 6px;">
        Pedido: #${code.toUpperCase() || 'MRB-78291'} — EN CAMINO
      </div>
      <div style="font-size: 13px; color: #374151; line-height: 1.5;">
        <strong>Operador Logístico:</strong> Shalom Express / Despacho 24h<br>
        <strong>Destino:</strong> Lima & Provincias Perú<br>
        <strong>Estado actual:</strong> Paquete verificado en almacén central. Entrega estimada: Mañana antes de las 6:00 PM.
      </div>
    </div>
  `;
}

// 9. Mobile Navigation Drawer Logic
const navDrawerOverlay = document.getElementById("navDrawerOverlay");
const navDrawer = document.getElementById("navDrawer");

function openNavDrawer() {
  navDrawerOverlay.classList.add("open");
  navDrawer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeNavDrawer() {
  navDrawerOverlay.classList.remove("open");
  navDrawer.classList.remove("open");
  document.body.style.overflow = "";
}

// 10. Live Search & Category Filtering
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");

function toggleSearch() {
  searchBar.classList.toggle("active");
  if (searchBar.classList.contains("active")) {
    searchInput.focus();
  }
}

function handleSearchInput(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll(".product-card, .featured-card");

  cards.forEach(card => {
    const title = card.querySelector(".product-card-title, .featured-card-title")?.textContent.toLowerCase() || "";
    const desc = card.querySelector(".product-card-desc, .featured-card-desc")?.textContent.toLowerCase() || "";
    
    if (!q || title.includes(q) || desc.includes(q)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function filterCategory(categoryKey, chipEl) {
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("active"));
  if (chipEl) chipEl.classList.add("active");

  const cards = document.querySelectorAll(".product-card");
  const featured = document.querySelector(".featured-card");

  if (categoryKey === "todos") {
    cards.forEach(c => c.style.display = "");
    if (featured) featured.style.display = "";
    return;
  }

  if (featured) {
    featured.style.display = (categoryKey === "electricas" || categoryKey === "ofertas") ? "" : "none";
  }

  cards.forEach(card => {
    const pId = card.getAttribute("data-id");
    const product = PRODUCTS.find(p => p.id === pId);
    if (!product) return;

    if (categoryKey === "ofertas") {
      card.style.display = product.originalPrice ? "" : "none";
    } else if (product.category === categoryKey) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  // Smooth scroll to catalog section
  document.getElementById("catalogoSection")?.scrollIntoView({ behavior: "smooth" });
}

// 11. Viewport Switcher (Móvil vs Escritorio)
function setViewportMode(mode) {
  const btnMobile = document.getElementById("btnViewMobile");
  const btnWide = document.getElementById("btnViewWide");

  if (mode === "wide") {
    document.body.classList.add("wide-view");
    btnWide.classList.add("active");
    btnMobile.classList.remove("active");
  } else {
    document.body.classList.remove("wide-view");
    btnMobile.classList.add("active");
    btnWide.classList.remove("active");
  }
}

// 12. Bottom Navigation Tab Handler
function handleBottomNav(tabName, itemEl) {
  document.querySelectorAll(".bottom-nav-item").forEach(item => item.classList.remove("active"));
  itemEl.classList.add("active");

  if (tabName === "tienda") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (tabName === "categorias") {
    document.getElementById("categoriasSection")?.scrollIntoView({ behavior: "smooth" });
  } else if (tabName === "ofertas") {
    filterCategory("ofertas", null);
  } else if (tabName === "bolsa") {
    openCart();
  } else if (tabName === "cuenta") {
    openTrackingModal();
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  console.log("MARUBI Storefront Engine Loaded with updated product catalog.");
});
