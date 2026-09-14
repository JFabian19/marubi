/**
 * MARUBI - Landing Page Mobile-First Scripts
 * Lógica interactiva:
 * - Galería de producto (switcher de miniaturas)
 * - Checkout Modal centrado en pantalla
 * - Menús desplegables en cascada (Departamento -> Provincia -> Distrito de Perú)
 * - Costo de Envío dinámico (Lima: Pago contra entrega Lima | Provincias: Pago contra entrega Shalom)
 * - Upselling: Envío Prioritario (+S/. 10.00) centrado con recálculo dinámico
 * - Cuenta regresiva de urgencia
 * - Acordeón FAQ
 * - Envío de pedido y confirmación vía WhatsApp
 */

// =============================================================================
// BASE DE DATOS DE UBICACIONES DEL PERÚ (DEPARTAMENTOS, PROVINCIAS Y DISTRITOS)
// =============================================================================
const PERU_LOCATIONS = {
  "Lima": {
    "Lima Metropolitana": [
      "Miraflores", "San Isidro", "Santiago de Surco", "San Borja", "La Molina",
      "Magdalena del Mar", "San Miguel", "Jesús María", "Lince", "Pueblo Libre",
      "Barranco", "Breña", "Cercado de Lima", "Chorrillos", "Surquillo",
      "Los Olivos", "San Martín de Porres", "Comas", "Independencia", "Puente Piedra",
      "Carabayllo", "San Juan de Lurigancho", "Santa Anita", "Ate Vitarte", "El Agustino",
      "San Juan de Miraflores", "Villa María del Triunfo", "Villa El Salvador", "Rímac",
      "Lurigancho-Chosica", "Chaclacayo", "Pachacámac", "Lurín", "Ancón", "Santa Rosa",
      "Pucusana", "Punta Hermosa", "Punta Negra", "San Bartolo", "Santa María del Mar", "Cieneguilla"
    ],
    "Barranca": ["Barranca", "Paramonga", "Pativilca", "Supe", "Supe Puerto"],
    "Cañete": ["San Vicente de Cañete", "Asia", "Mala", "Imperial", "Cerro Azul", "Lunahuaná", "Chilca", "Nuevo Imperial", "Quilmaná", "San Antonio", "San Luis"],
    "Huaral": ["Huaral", "Chancay", "Aucallama"],
    "Huaura": ["Huacho", "Hualmay", "Santa María", "Carquín", "Huaura", "Sayán", "Végueta"],
    "Huarochirí": ["Matucana", "Ricardo Palma", "San Antonio", "San Mateo", "Santa Eulalia"]
  },
  "Callao": {
    "Callao": ["Callao Cercado", "Bellavista", "Carmen de la Legua", "La Perla", "La Punta", "Ventanilla", "Mi Perú"]
  },
  "Arequipa": {
    "Arequipa": [
      "Arequipa Cercado", "Yanahuara", "Cayma", "Cerro Colorado", "Paucarpata",
      "José Luis Bustamante y Rivero", "Miraflores", "Mariano Melgar", "Socabaya",
      "Jacobo Hunter", "Alto Selva Alegre", "Tiabaya", "Sachaca", "Uchumayo"
    ],
    "Camaná": ["Camaná", "José María Químper", "Mariscal Cáceres", "Nicolás de Piérola", "Ocoña", "Samuel Pastor"],
    "Caylloma": ["Chivay", "Cabanaconde", "Huambo", "Majes", "Yanque"],
    "Islay": ["Mollendo", "Cocachacra", "Dean Valdivia", "Islay", "Mejía", "Punta de Bombón"]
  },
  "La Libertad": {
    "Trujillo": [
      "Trujillo Cercado", "Víctor Larco Herrera", "Huanchaco", "El Porvenir",
      "Florencia de Mora", "Laredo", "Moche", "Salaverry", "La Esperanza"
    ],
    "Ascope": ["Ascope", "Casa Grande", "Chocope", "Paiján"],
    "Chepén": ["Chepén", "Pacanga", "Pueblo Nuevo"],
    "Pacasmayo": ["San Pedro de Lloc", "Pacasmayo", "Guadalupe"]
  },
  "Lambayeque": {
    "Chiclayo": ["Chiclayo Cercado", "José Leonardo Ortiz", "La Victoria", "Pimentel", "Reque", "Monsefú", "Santa Rosa"],
    "Ferreñafe": ["Ferreñafe", "Pueblo Nuevo", "Pitipo"],
    "Lambayeque": ["Lambayeque", "Mochumí", "Mórrope", "Motupe", "Olmos", "Túcume"]
  },
  "Piura": {
    "Piura": ["Piura Cercado", "Castilla", "Veintiséis de Octubre", "Catacaos", "Cura Mori", "La Arena", "Las Lomas", "Tambogrande"],
    "Sullana": ["Sullana", "Bellavista", "Marcavelica", "Querecotillo"],
    "Talara": ["Pariñas (Talara)", "El Alto", "La Brea", "Los Órganos", "Máncora"],
    "Paita": ["Paita", "Amotape", "Colán", "Vichayal"]
  },
  "Cusco": {
    "Cusco": ["Cusco Cercado", "Wanchaq", "San Sebastián", "San Jerónimo", "Santiago"],
    "Urubamba": ["Urubamba", "Ollantaytambo", "Machupicchu", "Maras"],
    "Calca": ["Calca", "Pisac", "Lamay", "San Salvador"],
    "Canchis": ["Sicuani", "Combapata", "Marangani"]
  },
  "Ancash": {
    "Santa": ["Chimbote", "Nuevo Chimbote", "Coishco", "Santa", "Samanco", "Nepeña"],
    "Huaraz": ["Huaraz", "Independencia", "Tarica"],
    "Casma": ["Casma", "Buena Vista Alta", "Comandante Noel"],
    "Huarmey": ["Huarmey", "Culebras"]
  },
  "Junin": {
    "Huancayo": ["Huancayo Cercado", "El Tambo", "Chilca", "Pilcomayo", "San Jerónimo de Tunán"],
    "Chanchamayo": ["Chanchamayo (La Merced)", "San Ramón", "Perené", "Pichanaqui"],
    "Tarma": ["Tarma", "Acobamba", "Palca"],
    "Satipo": ["Satipo", "Mazamari", "Pangoa", "Río Negro"]
  },
  "Ica": {
    "Ica": ["Ica Cercado", "Parcona", "Subtanjalla", "La Tinguiña", "Salas Guadalupe", "Los Aquijes"],
    "Chincha": ["Chincha Alta", "Chincha Baja", "Grocio Prado", "Pueblo Nuevo", "Sunampe"],
    "Pisco": ["Pisco", "Paracas", "San Andrés", "San Clemente", "Túpac Amaru Inca"],
    "Nazca": ["Nazca", "Marcona", "Vista Alegre"]
  },
  "San Martin": {
    "San Martín": ["Tarapoto", "Morales", "Banda de Shilcayo", "Cacatachi", "Chazuta"],
    "Moyobamba": ["Moyobamba", "Soritor", "Calzada", "Jepelacio"],
    "Rioja": ["Rioja", "Nueva Cajamarca", "Pardo Miguel"],
    "Mariscal Cáceres": ["Juanjuí", "Campanilla", "Huicungo"]
  },
  "Tacna": {
    "Tacna": ["Tacna Cercado", "Alto de la Alianza", "Ciudad Nueva", "Coronel Gregorio Albarracín", "Pocollay"]
  },
  "Cajamarca": {
    "Cajamarca": ["Cajamarca Cercado", "Baños del Inca", "Llacanora", "Los Baños"],
    "Jaén": ["Jaén", "Bellavista", "Pucará"],
    "Chota": ["Chota", "Lajas", "Tacabamba"]
  },
  "Loreto": {
    "Maynas": ["Iquitos", "Belén", "Punchana", "San Juan Bautista"]
  },
  "Ucayali": {
    "Coronel Portillo": ["Pucallpa", "Callería", "Yarinacocha", "Manantay"]
  },
  "Puno": {
    "Puno": ["Puno Cercado", "Acora", "Chucuito", "Paucarcolla"],
    "San Román": ["Juliaca", "Caracoto", "Cabana"]
  },
  "Huánuco": {
    "Huánuco": ["Huánuco Cercado", "Amarilis", "Pillco Marca"],
    "Leoncio Prado": ["Rupa-Rupa (Tingo María)", "Castillo Grande"]
  },
  "Ayacucho": {
    "Huamanga": ["Ayacucho Cercado", "Carmen Alto", "San Juan Bautista", "Jesús Nazareno"]
  },
  "Amazonas": {
    "Chachapoyas": ["Chachapoyas", "Huancas", "Levanto"],
    "Bagua": ["Bagua", "Aramango", "Copallín"],
    "Utcubamba": ["Bagua Grande", "Cajaruro"]
  },
  "Apurimac": {
    "Abancay": ["Abancay", "Tamburco"],
    "Andahuaylas": ["Andahuaylas", "San Jerónimo", "Talavera"]
  },
  "Huancavelica": {
    "Huancavelica": ["Huancavelica", "Ascensión"],
    "Tayacaja": ["Pampas", "Daniel Hernández"]
  },
  "Madre de Dios": {
    "Tambopata": ["Puerto Maldonado", "Inambari", "Las Piedras"]
  },
  "Moquegua": {
    "Mariscal Nieto": ["Moquegua", "Samegua", "Torata"],
    "Ilo": ["Ilo", "El Algarrobal", "Pacocha"]
  },
  "Pasco": {
    "Pasco": ["Chaupimarca (Cerro de Pasco)", "Yanacancha"],
    "Oxapampa": ["Oxapampa", "Villa Rica", "Pozuzo"]
  },
  "Tumbes": {
    "Tumbes": ["Tumbes", "Corrales", "La Cruz", "San Juan de la Virgen"],
    "Zarumilla": ["Zarumilla", "Aguas Verdes"]
  }
};

function trackMetaEvent(eventName, parameters = {}) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, parameters);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Galería de producto (switcher de miniaturas)
  initGallery();

  // 2. Control del Modal Centrado (abrir en el medio de la pantalla sin scroll)
  initCheckoutModal();

  // 3. Menús desplegables en cascada (Departamento -> Provincia -> Distrito) y Costo de Envío
  initCascadingLocations();

  // 4. Acordeón FAQ
  initFAQAccordion();

  // 5. Procesamiento y confirmación de pedido vía WhatsApp
  initOrderFormSubmission();
});

/**
 * 1. Switcher de la galería de producto (3 imágenes reales)
 */
function initGallery() {
  const thumbnails = document.querySelectorAll('.thumbnail-item');
  const mainProductImg = document.getElementById('mainProductImg');
  if (!mainProductImg || thumbnails.length === 0) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      thumb.classList.add('active');
      thumb.setAttribute('aria-pressed', 'true');

      const newSrc = thumb.getAttribute('data-src');

      if (newSrc) {
        mainProductImg.style.opacity = '0.3';
        setTimeout(() => {
          mainProductImg.src = newSrc;
          mainProductImg.style.opacity = '1';
        }, 120);
      }
    });
  });
}

/**
 * 2. Control del Modal Centrado en la pantalla (Aparece en el medio sin scroll)
 */
function initCheckoutModal() {
  const modalOverlay = document.getElementById('checkoutDrawerOverlay');
  const modalCloseBtn = document.getElementById('checkoutDrawerClose');
  const stickyMobileBar = document.getElementById('stickyMobileBar');
  const heroSection = document.querySelector('.hero-product-section');
  let lastTrigger = null;

  const checkoutTriggers = document.querySelectorAll(
    'a[href="#pedido"], a[href="#checkoutDrawer"], button[data-open-checkout], .btn-open-checkout'
  );

  function openModal(e) {
    if (e) e.preventDefault();
    if (modalOverlay) {
      const wasOpen = modalOverlay.classList.contains('active');
      lastTrigger = e?.currentTarget || document.activeElement;
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (!wasOpen) {
        trackMetaEvent('InitiateCheckout', {
          content_name: 'Climatizador de Pared 2 en 1',
          value: 109,
          currency: 'PEN'
        });
      }
      window.setTimeout(() => modalCloseBtn?.focus(), 30);
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
    }
  }

  checkoutTriggers.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Cerrar haciendo clic en el fondo oscurecido
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (!modalOverlay?.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
    }

    if (e.key === 'Tab') {
      const focusable = [...modalOverlay.querySelectorAll('button, input, select, [href], [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Sticky Mobile Bar
  if (stickyMobileBar && heroSection) {
    window.addEventListener('scroll', () => {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom < window.innerHeight * 0.35) {
        stickyMobileBar.classList.add('visible');
      } else {
        stickyMobileBar.classList.remove('visible');
      }
    }, { passive: true });
  }

  window.openCheckoutDrawer = openModal;
  window.closeCheckoutDrawer = closeModal;
}

/**
 * 3. Menús desplegables en cascada (Departamento -> Provincia -> Distrito)
 * y Costo de Envío dinámico idéntico a media_1789339613951.png
 */
function initCascadingLocations() {
  const deptSelect = document.getElementById('drawerDepartamento');
  const provSelect = document.getElementById('drawerProvincia');
  const distSelect = document.getElementById('drawerDistrito');
  const shippingCostContainer = document.getElementById('shippingCostCardContainer');

  if (!deptSelect || !provSelect || !distSelect || !shippingCostContainer) return;

  // Llenar Departamentos
  const deptList = Object.keys(PERU_LOCATIONS);
  deptList.forEach(dept => {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.textContent = dept;
    deptSelect.appendChild(opt);
  });

  // Evento cambio de Departamento
  deptSelect.addEventListener('change', () => {
    const selectedDept = deptSelect.value;
    
    // Resetear Provincias y Distritos con los textos de la imagen
    provSelect.innerHTML = '<option value="" disabled selected>Primero selecciona tu departamento</option>';
    distSelect.innerHTML = '<option value="" disabled selected>Primero selecciona tu provincia</option>';
    provSelect.disabled = !selectedDept;
    distSelect.disabled = true;

    if (selectedDept && PERU_LOCATIONS[selectedDept]) {
      const provinces = Object.keys(PERU_LOCATIONS[selectedDept]);
      provinces.forEach(prov => {
        const opt = document.createElement('option');
        opt.value = prov;
        opt.textContent = prov;
        provSelect.appendChild(opt);
      });

      // Si solo tiene una provincia (ej. Callao), seleccionarla automáticamente
      if (provinces.length === 1) {
        provSelect.value = provinces[0];
        provSelect.dispatchEvent(new Event('change'));
      }
    }

    // Actualizar Costo de Envío según Lima vs Provincias
    updateShippingCost(selectedDept);
  });

  // Evento cambio de Provincia
  provSelect.addEventListener('change', () => {
    const selectedDept = deptSelect.value;
    const selectedProv = provSelect.value;

    distSelect.innerHTML = '<option value="" disabled selected>Primero selecciona tu provincia</option>';
    distSelect.disabled = !selectedProv;

    if (selectedDept && selectedProv && PERU_LOCATIONS[selectedDept] && PERU_LOCATIONS[selectedDept][selectedProv]) {
      const districts = PERU_LOCATIONS[selectedDept][selectedProv];
      districts.forEach(dist => {
        const opt = document.createElement('option');
        opt.value = dist;
        opt.textContent = dist;
        distSelect.appendChild(opt);
      });
    }
  });

  function updateShippingCost(department) {
    if (!shippingCostContainer) return;

    if (!department) {
      shippingCostContainer.innerHTML = `
        <div class="shipping-cost-card">
          <div class="shipping-cost-text">
            <div class="shipping-cost-title">Envío gratis</div>
            <div class="shipping-cost-desc">Selecciona tu ubicación para ver la modalidad</div>
          </div>
        </div>
      `;
    } else if (department === 'Lima' || department === 'Callao') {
      // Para Lima / Callao: Opción principal Pago contra entrega Lima
      shippingCostContainer.innerHTML = `
        <div class="shipping-cost-card selected">
          <input type="radio" name="shippingMethod" value="contra_entrega_lima" checked class="shipping-cost-radio">
          <div class="shipping-cost-text">
            <div class="shipping-cost-title">Envío gratis</div>
            <div class="shipping-cost-desc">Pago contra entrega Lima</div>
          </div>
        </div>
      `;
    } else {
      // Para provincias coordinamos la agencia después del registro.
      shippingCostContainer.innerHTML = `
        <div class="shipping-cost-card selected">
          <input type="radio" name="shippingMethod" value="agencia_provincia" checked class="shipping-cost-radio">
          <div class="shipping-cost-text">
            <div class="shipping-cost-title">Envío gratis</div>
            <div class="shipping-cost-desc">Despacho por agencia, coordinado por WhatsApp</div>
          </div>
        </div>
      `;
    }

    // Listener para marcar activo
    const cards = shippingCostContainer.querySelectorAll('.shipping-cost-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  }

  // Inicializar con estado por defecto
  updateShippingCost('');
}

/**
 * 4. Acordeón de Preguntas Frecuentes (FAQ)
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherButton = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerEl.style.maxHeight = null;
      }
    });
  });
}

/**
 * 5. Validación del Checkout Modal y Redirección Directa a WhatsApp
 */
function initOrderFormSubmission() {
  const form = document.getElementById('drawerOrderForm');
  const whatsappInput = document.getElementById('drawerWhatsapp');
  if (!form) return;

  if (whatsappInput) {
    whatsappInput.addEventListener('input', () => {
      whatsappInput.value = whatsappInput.value.replace(/\D/g, '').slice(0, 9);
      const isValid = /^9\d{8}$/.test(whatsappInput.value);
      whatsappInput.setCustomValidity(whatsappInput.value && !isValid
        ? 'Ingresa un número de WhatsApp de 9 dígitos que comience con 9.'
        : '');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('drawerNombre').value.trim();
    const celular = document.getElementById('drawerWhatsapp').value.trim();
    const departamento = document.getElementById('drawerDepartamento').value;
    const provincia = document.getElementById('drawerProvincia').value;
    const distrito = document.getElementById('drawerDistrito').value;
    const direccion = document.getElementById('drawerDireccion').value.trim();
    const referencia = document.getElementById('drawerReferencia').value.trim();

    // Validación número peruano (9 dígitos)
    const phoneDigits = celular.replace(/\D/g, '');
    if (!/^9\d{8}$/.test(phoneDigits)) {
      alert('Ingresa un número de WhatsApp válido: 9 dígitos y debe comenzar con 9.');
      document.getElementById('drawerWhatsapp').focus();
      return;
    }

    if (!departamento || !provincia || !distrito) {
      alert('Por favor, selecciona Departamento, Provincia y Distrito de entrega.');
      return;
    }

    const finalPrice = 109.00;
    const orderNumber = 'MRB-' + Math.floor(100000 + Math.random() * 900000);

    const selectedShippingRadio = document.querySelector('input[name="shippingMethod"]:checked');
    let metodoTexto = 'Despacho por agencia (Provincia)';
    if (selectedShippingRadio?.value === 'contra_entrega_lima') metodoTexto = 'Pago contra entrega Lima';

    // Formatear mensaje para WhatsApp
    const waText = `¡Hola MARUBI! Acabo de registrar mi pedido en la tienda:%0A%0A` +
      `📦 *Pedido:* %23${orderNumber}%0A` +
      `👤 *Cliente:* ${encodeURIComponent(nombre)}%0A` +
      `📱 *WhatsApp:* ${phoneDigits}%0A` +
      `📍 *Ubicación:* ${encodeURIComponent(distrito)}, ${encodeURIComponent(provincia)}, ${encodeURIComponent(departamento)}%0A` +
      `🏠 *Dirección:* ${encodeURIComponent(direccion)}%0A` +
      (referencia ? `🔍 *Referencia:* ${encodeURIComponent(referencia)}%0A` : '') +
      `🚚 *Modalidad de Envío:* ${encodeURIComponent(metodoTexto)}%0A` +
      `🌬️ *Producto:* Climatizador de Pared 2 en 1%0A` +
      `💰 *Total a pagar:* S/. ${finalPrice.toFixed(2)}%0A%0A` +
      `Deseo confirmar la entrega de mi pedido. ¡Gracias!`;

    const waUrl = `https://wa.me/51912345678?text=${waText}`;

    trackMetaEvent('Lead', {
      content_name: 'Climatizador de Pared 2 en 1',
      value: finalPrice,
      currency: 'PEN'
    });

    window.open(waUrl, '_blank');

    if (window.closeCheckoutDrawer) {
      window.closeCheckoutDrawer();
    }
    form.reset();
  });
}
