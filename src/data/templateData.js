/**
 * DATOS DE PLANTILLA (VACÍOS PARA RELLENAR)
 * Aquí puedes agregar tus productos, colecciones y textos sin tocar el código de los componentes.
 */

export const TICKER_ITEMS = [
  'PAGO CONTRA ENTREGA EN LIMA',
  'ENVÍO GRATIS A TODO EL PERÚ POR SHALOM',
  'PACK NAVIDEÑO DE 15 PIEZAS',
  'MARIPOSA LED DESDE S/ 149.90',
];

export const BESTSELLERS_PLACEHOLDERS = [
  {
    id: 'prod-1',
    slug: 'pack-navideno-15-piezas',
    title: 'Pack Navideño de Mesa · 15 piezas',
    salePrice: 'S/ 169.90',
    comparePrice: 'S/ 209.90',
    discountBadge: 'OFERTA EXCLUSIVA',
    image: '/assets/navidad/pack-navidad-15-piezas.jpg',
  },
  {
    id: 'prod-2',
    slug: 'mariposa-led-navidad',
    title: 'Mariposa LED Navideña · 35 cm aprox.',
    salePrice: 'S/ 149.90',
    comparePrice: '',
    discountBadge: '2 POR S/ 199.90',
    image: '/assets/mariposa/mariposa-arbol.jpg',
  },
  {
    id: 'prod-3',
    placeholderLabel: 'Imagen del Producto 3',
    title: '[ Nombre del Producto 3 — Haz clic para ver plantilla ]',
    salePrice: 'S/ 00.00',
    comparePrice: 'S/ 00.00',
    discountBadge: '00% OFF',
    image: '',
  },
  {
    id: 'prod-4',
    placeholderLabel: 'Imagen del Producto 4',
    title: '[ Nombre del Producto 4 — Haz clic para ver plantilla ]',
    salePrice: 'S/ 00.00',
    comparePrice: 'S/ 00.00',
    discountBadge: '00% OFF',
    image: '',
  },
  {
    id: 'prod-5',
    placeholderLabel: 'Imagen del Producto 5',
    title: '[ Nombre del Producto 5 — Haz clic para ver plantilla ]',
    salePrice: 'S/ 00.00',
    comparePrice: 'S/ 00.00',
    discountBadge: '00% OFF',
    image: '',
  },
  {
    id: 'prod-6',
    placeholderLabel: 'Imagen del Producto 6',
    title: '[ Nombre del Producto 6 — Haz clic para ver plantilla ]',
    salePrice: 'S/ 00.00',
    comparePrice: 'S/ 00.00',
    discountBadge: '00% OFF',
    image: '',
  },
];

export const FEATURED_COLLECTION_TWO_COL = [
  {
    id: 'col-a',
    placeholderLabel: 'Imagen Producto Colección A',
    title: '[ Nombre del Producto Destacado A — Haz clic para abrir plantilla ]',
    salePrice: 'S/ 00.00',
    comparePrice: 'S/ 00.00',
    discountBadge: '00% OFF',
    image: '',
  },
  {
    id: 'col-b',
    placeholderLabel: 'Imagen Producto Colección B',
    title: '[ Nombre del Producto Destacado B — Haz clic para abrir plantilla ]',
    salePrice: 'S/ 00.00',
    comparePrice: 'S/ 00.00',
    discountBadge: '00% OFF',
    image: '',
  },
];

export const MULTIROW_ITEMS = [
  {
    id: 'row-1',
    caption: '[ ¿PREGUNTA O PROBLEMA 1? ]',
    heading: '[ Producto / Línea 1 ]',
    text: '[ Espacio de plantilla para describir en una frase cómo este producto resuelve una necesidad rápida en el hogar. ]',
    image: '/assets/confort-todo-el-ano.webp',
    reverse: false,
  },
  {
    id: 'row-2',
    caption: '[ SUBTÍTULO DE BENEFICIO 2 ]',
    heading: '[ Producto / Línea 2 ]',
    text: '[ Espacio de plantilla para resaltar el ahorro de tiempo, dinero o esfuerzo que brinda tu segundo producto estrella. ]',
    image: '/assets/ola-de-calor-control.webp',
    reverse: true,
  },
  {
    id: 'row-3',
    caption: '[ CATEGORÍA DESTACADA 3 ]',
    heading: '[ Producto / Línea 3 ]',
    text: '[ Espacio de plantilla para presentar una tercera solución práctica de tu catálogo MARUBI. ]',
    image: '/assets/no-ocupa-espacio-piso.webp',
    reverse: false,
  },
];

export const PRODUCT_PAGE_TEMPLATE = {
  breadcrumbName: 'Pack Navideño de Mesa · 15 piezas',
  eyebrow: 'OFERTA EXCLUSIVA · MESA NAVIDEÑA',
  title: 'Pack Navideño de Mesa · 15 piezas',
  lead: 'Prepara una mesa llena de color para compartir esta Navidad. El pack reúne platos dorados, bowls con orejitas, un plato en forma de árbol y tazas Merry Christmas en una sola compra.',
  priceCurrent: 'S/ 169.90',
  priceRegular: 'S/ 209.90',
  priceSave: 'Ahorras S/ 40.00',
  ctaLabel: 'Pedir mi pack — S/ 169.90',
  gallery: [
    { src: '/assets/navidad/pack-navidad-15-piezas.jpg', label: 'Pack navideño completo de 15 piezas' },
    { src: '/assets/navidad/platos-dorados.jpg', label: 'Seis platos dorados de polipropileno' },
    { src: '/assets/navidad/bowl-rojo.jpg', label: 'Bowl de cerámica con orejitas y diseño rojo' },
    { src: '/assets/navidad/bowl-verde.jpg', label: 'Bowl de cerámica con orejitas y diseño verde' },
    { src: '/assets/navidad/plato-arbol.jpg', label: 'Plato navideño con forma de árbol' },
    { src: '/assets/navidad/taza-roja.jpg', label: 'Taza Merry Christmas con asa roja' },
    { src: '/assets/navidad/taza-verde.jpg', label: 'Taza Merry Christmas con asa verde' },
  ],
  purchasePoints: [
    { bold: '15 piezas', rest: 'para vestir tu mesa navideña' },
    { bold: 'Envío gratis', rest: 'a todo el Perú a través de Shalom' },
    { bold: 'Oferta exclusiva', rest: 'S/ 169.90 por el pack completo' },
  ],
  proofStrip: [
    { strong: '15 piezas', span: 'Un pack para celebrar' },
    { strong: 'S/ 169.90', span: 'Precio de oferta exclusiva' },
    { strong: 'S/ 40 menos', span: 'Frente a S/ 209.90' },
    { strong: 'Envío gratis', span: 'A todo el Perú por Shalom' },
  ],
  expectation: {
    eyebrow: 'UNA MESA PARA COMPARTIR',
    heading: 'Todo listo para darle un toque navideño a tu mesa',
    intro: 'Combina los platos dorados con las piezas de diseño festivo para servir bocaditos, postres o bebidas. Las tazas y los bowls aportan los detalles rojos y verdes de la temporada.',
    image: '/assets/navidad/pack-navidad-15-piezas.jpg',
    caption: 'El pack reúne las cuatro clases de piezas en una sola propuesta.',
    steps: [
      { num: '01', title: 'Arma una mesa festiva', text: 'Seis platos dorados dan una base luminosa a cada lugar de la mesa.' },
      { num: '02', title: 'Sirve y decora', text: 'Dos bowls con orejitas y un plato de árbol suman espacio para acompañamientos o dulces.' },
      { num: '03', title: 'Comparte una bebida', text: 'Las seis tazas redondas llevan diseños Merry Christmas en rojo y verde.' },
    ],
  },
  features: {
    eyebrow: 'LO QUE INCLUYE TU PACK',
    heading: '15 piezas para celebrar a tu manera',
    subtitle: 'Cada tipo de pieza aporta una función y un detalle visual a la mesa.',
    items: [
      { num: '06', title: 'Platos dorados', text: 'Seis platos de polipropileno con acabados navideños.' },
      { num: '02', title: 'Bowls con orejitas', text: 'Dos bowls de cerámica, uno con diseño rojo y otro verde.' },
      { num: '01', title: 'Plato de árbol', text: 'Una pieza en forma de árbol, roja con estrellas y franjas blancas.' },
      { num: '06', title: 'Tazas Merry Christmas', text: 'Seis tazas redondas con diseños navideños en rojo y verde.' },
    ],
  },
  specs: {
    eyebrow: 'DETALLE DEL PACK',
    heading: 'Qué llega en tu pedido',
    intro: 'El precio corresponde al pack completo. Las imágenes muestran los diseños de las piezas incluidas.',
    rows: [
      { dt: 'Contenido total', dd: '15 piezas' },
      { dt: 'Platos', dd: '6 de polipropileno, diseños dorados' },
      { dt: 'Bowls', dd: '2 de cerámica con orejitas' },
      { dt: 'Pieza especial', dd: '1 plato con forma de árbol' },
      { dt: 'Tazas', dd: '6 redondas con diseño Merry Christmas' },
      { dt: 'Precio de oferta', dd: 'S/ 169.90 por el pack completo' },
      { dt: 'Envío', dd: 'Gratis a todo el Perú a través de Shalom' },
    ],
  },
  faqs: [
    { id: 'faq-1', q: '¿Cuántas piezas trae el pack?', a: 'Son 15 piezas: 6 platos de polipropileno, 2 bowls de cerámica con orejitas, 1 plato en forma de árbol y 6 tazas Merry Christmas.' },
    { id: 'faq-2', q: '¿El precio es por todo el pack?', a: 'Sí. La oferta exclusiva de S/ 169.90 corresponde al pack completo de 15 piezas.' },
    { id: 'faq-3', q: '¿Cuánto cuesta el envío?', a: 'El envío es gratis a todo el Perú a través de Shalom. Coordinaremos contigo los datos de entrega o recojo al confirmar el pedido.' },
    { id: 'faq-4', q: '¿Los bowls tienen orejitas?', a: 'Sí. El pack incluye dos bowls de cerámica con orejitas, con diseños navideños rojo y verde.' },
    { id: 'faq-5', q: '¿Cómo confirmo mi pedido?', a: 'Completa tus datos y continúa por WhatsApp. Nuestro equipo confirmará la disponibilidad y la coordinación del envío por Shalom.' },
  ],
};

export const BUTTERFLY_PRODUCT_PAGE = {
  breadcrumbName: 'Mariposa LED Navideña',
  eyebrow: 'DECORACIÓN NAVIDEÑA ILUMINADA',
  title: 'Mariposa LED Navideña · 35 cm aprox.',
  lead: 'Dale un punto de luz cálida y especial a tu árbol. Su silueta de alas translúcidas resalta entre las ramas y aporta un detalle que se ve tanto de día como de noche.',
  priceCurrent: 'S/ 149.90',
  priceRegular: '',
  priceSave: '',
  ctaLabel: 'Pedir 1 mariposa — S/ 149.90',
  offers: [
    { id: 'single', label: '1 mariposa', price: 'S/ 149.90', value: 149.9, detail: 'Para un punto de luz especial' },
    { id: 'duo', label: 'Pack de 2 mariposas', price: 'S/ 199.90', value: 199.9, detail: 'Ahorras S/ 99.90 frente a dos unidades' },
  ],
  gallery: [
    { src: '/assets/mariposa/mariposa-arbol.jpg', label: 'Mariposa LED encendida en un árbol nevado' },
    { src: '/assets/mariposa/mariposa-producto.jpg', label: 'Vista frontal de la mariposa iluminada' },
    { src: '/assets/mariposa/mariposa-detalle.jpg', label: 'Detalle de las alas y el cuerpo de la mariposa' },
    { src: '/assets/mariposa/mariposa-pack-dos.jpg', label: 'Dos mariposas LED encendidas en un árbol' },
    { src: '/assets/mariposa/mariposa-foto-real.jpg', label: 'Fotografía real de la mariposa encendida en tienda' },
  ],
  purchasePoints: [
    { bold: 'Luz cálida', rest: 'con alas translúcidas iluminadas' },
    { bold: '35 cm aprox.', rest: 'según el punto de medición' },
    { bold: 'Envío gratis', rest: 'a todo el Perú a través de Shalom' },
  ],
  proofStrip: [
    { strong: '1 por S/ 149.90', span: 'Mariposa individual' },
    { strong: '2 por S/ 199.90', span: 'Pack de dos mariposas' },
    { strong: 'Luz cálida', span: 'Para resaltar tu decoración' },
    { strong: 'Envío gratis', span: 'A todo el Perú por Shalom' },
  ],
  expectation: {
    eyebrow: 'UN DETALLE QUE DESTACA',
    heading: 'Haz brillar tu árbol con una mariposa',
    intro: 'Las alas transparentes dejan ver sus líneas decorativas, mientras la luz cálida perfila la forma. Puedes usar una como acento o elegir el pack de dos para repetir el efecto en distintas zonas del árbol.',
    image: '/assets/mariposa/mariposa-detalle.jpg',
    caption: 'Vista cercana de la mariposa encendida entre ramas nevadas.',
    steps: [
      { num: '01', title: 'Colócala entre las ramas', text: 'Su cuerpo y alas crean un punto de atención en la decoración del árbol.' },
      { num: '02', title: 'Enciende su luz cálida', text: 'El borde iluminado dibuja las alas y contrasta con el follaje.' },
      { num: '03', title: 'Elige una o dos', text: 'Compra una unidad o aprovecha el precio especial del pack de dos.' },
    ],
  },
  features: {
    eyebrow: 'ASÍ ES LA MARIPOSA',
    heading: 'Luz y forma en un solo adorno',
    subtitle: 'Un detalle para la decoración navideña, disponible por unidad o en pack de dos.',
    items: [
      { num: '01', title: 'Alas translúcidas', text: 'Sus líneas y bordes permiten apreciar el efecto de la iluminación.' },
      { num: '02', title: 'Cuerpo ámbar', text: 'El centro aporta un tono dorado a la pieza.' },
      { num: '03', title: 'Luz cálida', text: 'Crea un brillo suave y festivo entre las ramas.' },
      { num: '04', title: 'Con cable', text: 'La pieza mostrada se ilumina mediante cable; confirma la conexión al hacer tu pedido.' },
    ],
  },
  specs: {
    eyebrow: 'DETALLE DEL PRODUCTO',
    heading: 'Lo esencial antes de pedir',
    intro: 'La medida se presenta como aproximada y puede variar según desde dónde se mida la figura.',
    rows: [
      { dt: 'Producto', dd: 'Mariposa decorativa LED navideña' },
      { dt: 'Medida referencial', dd: '35 cm aprox., según el punto de medición' },
      { dt: 'Color de luz', dd: 'Cálida' },
      { dt: 'Presentación', dd: '1 mariposa o pack de 2' },
      { dt: 'Precio individual', dd: 'S/ 149.90' },
      { dt: 'Precio pack x2', dd: 'S/ 199.90' },
      { dt: 'Envío', dd: 'Gratis a todo el Perú a través de Shalom' },
    ],
  },
  videoLabels: ['Cómo luce encendida', 'Detalle y tamaño', 'Ideas para colocarla'],
  videoIntro: 'Estamos preparando videos reales para mostrarte la iluminación, el tamaño y cómo queda en el árbol.',
  deliveryHeading: 'Tu mariposa viaja por Shalom',
  faqs: [
    { id: 'faq-1', q: '¿Cuánto cuesta una mariposa?', a: 'Una mariposa cuesta S/ 149.90.' },
    { id: 'faq-2', q: '¿Cuánto cuesta el pack de dos?', a: 'Dos mariposas cuestan S/ 199.90 en total. Ahorras S/ 99.90 frente a comprar dos unidades por separado.' },
    { id: 'faq-3', q: '¿Qué tamaño tiene?', a: 'La medida referencial es de 35 cm aproximadamente. Puede variar según el punto desde donde se mida la figura.' },
    { id: 'faq-4', q: '¿Cómo se ilumina?', a: 'La pieza fotografiada tiene cable y emite una luz cálida. Podemos confirmar contigo los detalles de conexión antes del envío.' },
    { id: 'faq-5', q: '¿Cómo llega mi pedido?', a: 'El envío es gratis a todo el Perú a través de Shalom. Coordinaremos los datos de entrega o recojo por WhatsApp.' },
  ],
};

export const getProductPage = (productId) =>
  productId === 'prod-2' ? BUTTERFLY_PRODUCT_PAGE : PRODUCT_PAGE_TEMPLATE;
