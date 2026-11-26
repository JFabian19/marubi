/** @OnlyCurrentDoc */
// Proyecto vinculado a "Registro de Ventas y Pedidos - MARUBI Perú"
// Spreadsheet ID: 1pRE3rVxLk4KxdDFz4jfAwETVm6XikmuL6lCq2InD1PM
// Desplegar como aplicación web.
const HEADERS = [
  'Fecha y hora', 'N.º de pedido', 'Estado', 'Producto ID', 'Producto',
  'Oferta', 'Cantidad', 'Total (PEN)', 'Nombre y apellido', 'WhatsApp',
  'Departamento', 'Provincia', 'Distrito', 'Dirección', 'Referencia',
  'Envío', 'Página de origen', 'Seguimiento de entrega',
];

const DELIVERY_STATUS_OPTIONS = ['Confirmado', 'No confirmado'];
const DEFAULT_DELIVERY_STATUS = 'No confirmado';

// Paleta de 12 tonos pastel distintos para diferenciar visualmente cada pedido.
const ORDER_ROW_COLORS = [
  '#E0F2FE', '#FEF3C7', '#EDE9FE', '#DCFCE7',
  '#FFE4E6', '#FFEDD5', '#CCFBF1', '#E0E7FF',
  '#ECFCCB', '#FCE7F3', '#CFFAFE', '#FEF9C3',
];

function ordersSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (!sheet) throw new Error('No se encontró la hoja de pedidos');
  return sheet;
}

function safeText_(value, maxLength) {
  const text = String(value == null ? '' : value).trim().slice(0, maxLength);
  // Evita que los datos del comprador se interpreten como fórmulas de Sheets.
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function findOrder_(sheet, orderId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  return sheet.getRange(2, 2, lastRow - 1, 1)
    .createTextFinder(orderId).matchEntireCell(true).findNext() !== null;
}

function styleOrderRow_(sheet, rowNumber) {
  if (rowNumber < 2) return;
  const color = ORDER_ROW_COLORS[(rowNumber - 2) % ORDER_ROW_COLORS.length];
  const leftRange = sheet.getRange(rowNumber, 1, 1, 2);
  const bodyRange = sheet.getRange(rowNumber, 4, 1, 14);
  if (leftRange && typeof leftRange.setBackground === 'function') leftRange.setBackground(color);
  if (bodyRange && typeof bodyRange.setBackground === 'function') bodyRange.setBackground(color);

  const deliveryCell = sheet.getRange(rowNumber, 18, 1, 1);
  if (deliveryCell && typeof deliveryCell.setHorizontalAlignment === 'function') {
    deliveryCell.setHorizontalAlignment('center');
  }
  if (deliveryCell && typeof deliveryCell.setDataValidation === 'function' && typeof SpreadsheetApp.newDataValidation === 'function') {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(DELIVERY_STATUS_OPTIONS, true)
      .setAllowInvalid(false)
      .build();
    deliveryCell.setDataValidation(rule);
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Solicitud vacía');
    const order = JSON.parse(e.postData.contents);
    if (order.type === 'lead') return sendLead_(order);
    if (!/^MRB-[a-f0-9-]{36}$/i.test(order.orderId || '')) throw new Error('ID inválido');
    if (!/^9\d{8}$/.test(order.whatsapp || '')) throw new Error('WhatsApp inválido');
    const newDelivery = order.deliveryMethod === 'shalom' || order.deliveryMethod === 'lima';
    const deliveryValid = newDelivery ? !!order.place && (order.deliveryMethod !== 'lima' || !!order.address) : !!order.department && !!order.province && !!order.district && !!order.address;
    if (!order.name || !deliveryValid || !order.productId || !order.productName) {
      throw new Error('Faltan datos obligatorios');
    }
    const total = Number(order.total);
    const quantity = Number(order.quantity);
    if (!Number.isFinite(total) || total <= 0 || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Total o cantidad inválidos');
    }

    let deliveryText = newDelivery
      ? (order.deliveryMethod === 'shalom' ? 'Recojo Shalom: ' : 'Entrega Lima: ') + safeText_(order.place, 200)
      : 'Gratis por Shalom';
    if (order.productId === 'MRB-ORG-5N') {
      const provincial = order.department !== 'Lima' && order.department !== 'Callao';
      const fee = provincial ? 20 : 0;
      const merchandiseTotal = quantity === 2 ? 180 : 99;
      if (!order.department || !order.district || !order.address || !order.reference ||
          order.deliveryMethod !== (provincial ? 'shalom' : 'lima') ||
          ![1, 2].includes(quantity) || Number(order.shippingFee) !== fee ||
          Number(order.advance) !== (provincial ? 40 : 0) || total !== merchandiseTotal + fee ||
          (provincial && !/^\d{8}$/.test(order.dni || ''))) {
        throw new Error('Datos de entrega o importe incorrectos');
      }
      deliveryText += ' · Envío S/ ' + fee;
      if (provincial) deliveryText += ' · Adelanto S/ 40 · DNI ' + order.dni;
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = ordersSheet_();
      if (!findOrder_(sheet, order.orderId)) {
        sheet.appendRow([
          new Date(), order.orderId, 'Pendiente de confirmación',
          safeText_(order.productId, 100), safeText_(order.productName, 250),
          safeText_(order.offer || '', 120), quantity, total,
          safeText_(order.name, 160), safeText_(order.whatsapp, 9),
          safeText_(order.department || '', 100), safeText_(order.province || '', 100),
          safeText_(order.district || order.place || '', 100), safeText_(order.address, 300),
          safeText_(order.reference || '', 250),
          deliveryText, safeText_(order.pageUrl || '', 500),
          DEFAULT_DELIVERY_STATUS,
        ]);
        styleOrderRow_(sheet, sheet.getLastRow());
        SpreadsheetApp.flush();
      }
    } finally {
      lock.releaseLock();
    }
    return ContentService.createTextOutput('ok');
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput('error');
  }
}

// Respuesta JSONP limitada a la existencia de un ID aleatorio. Nunca devuelve datos personales.
function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  const orderId = String((e && e.parameter && e.parameter.orderId) || '');
  if (!/^__marubiStatus[a-f0-9]{32}$/.test(callback) || !/^MRB-[a-f0-9-]{36}$/i.test(orderId)) {
    return ContentService.createTextOutput('Solicitud inválida');
  }
  const found = findOrder_(ordersSheet_(), orderId);
  return ContentService.createTextOutput(callback + '(' + (found ? 'true' : 'false') + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// Configurar META_PIXEL_ID y META_ACCESS_TOKEN como propiedades privadas del proyecto.
// META_TEST_EVENT_CODE es opcional y solo debe usarse durante las pruebas.
function sendLead_(event) {
  if (!/^[a-f0-9-]{36}$/i.test(event.eventId || '')) throw new Error('ID de evento inválido');
  const props = PropertiesService.getScriptProperties();
  const pixel = props.getProperty('META_PIXEL_ID');
  const token = props.getProperty('META_ACCESS_TOKEN');
  if (!pixel || !token) throw new Error('Conversion API no configurada');
  const user = {};
  if (event.fbp) user.fbp = String(event.fbp).slice(0, 200);
  if (event.fbc) user.fbc = String(event.fbc).slice(0, 200);
  if (event.userAgent) user.client_user_agent = String(event.userAgent).slice(0, 500);
  const payload = { data: [{ event_name: 'Lead', event_time: Math.floor(Date.now()/1000), event_id: event.eventId, event_source_url: String(event.pageUrl || '').slice(0, 500), action_source: 'website', user_data: user }] };
  const test = props.getProperty('META_TEST_EVENT_CODE');
  if (test) payload.test_event_code = test;
  const response = UrlFetchApp.fetch('https://graph.facebook.com/v21.0/' + encodeURIComponent(pixel) + '/events', { method: 'post', contentType: 'application/json', payload: JSON.stringify(Object.assign({ access_token: token }, payload)), muteHttpExceptions: true });
  if (response.getResponseCode() >= 300) throw new Error('Meta rechazó el evento: ' + response.getResponseCode());
  return ContentService.createTextOutput('ok');
}
