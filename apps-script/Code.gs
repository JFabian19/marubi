/** @OnlyCurrentDoc */
// Proyecto vinculado a "Pedidos MARUBI". Desplegar como aplicación web.
const HEADERS = [
  'Fecha y hora', 'N.º de pedido', 'Estado', 'Producto ID', 'Producto',
  'Oferta', 'Cantidad', 'Total (PEN)', 'Nombre y apellido', 'WhatsApp',
  'Departamento', 'Provincia', 'Distrito', 'Dirección', 'Referencia',
  'Envío', 'Página de origen',
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
          newDelivery ? (order.deliveryMethod === 'shalom' ? 'Recojo Shalom: ' : 'Entrega Lima: ') + safeText_(order.place, 200) : 'Gratis por Shalom', safeText_(order.pageUrl || '', 500),
        ]);
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
