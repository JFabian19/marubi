import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Exercise the existing Apps Script entry points entirely in memory.
const rows = [];
const rowColors = new Map();
const validations = new Map();
const sheet = {
  getLastRow: () => rows.length + 1,
  appendRow: row => rows.push(row),
  getRange(row, col) {
    return {
      createTextFinder(id) {
        return { matchEntireCell: () => ({ findNext: () => rows.find(r => r[1] === id) ?? null }) };
      },
      setBackground(color) {
        rowColors.set(row, color);
      },
      setHorizontalAlignment() {},
      setDataValidation(rule) {
        validations.set(`${row}:${col}`, rule);
      },
    };
  },
};
const context = vm.createContext({
  SpreadsheetApp: {
    getActiveSpreadsheet: () => ({ getSheets: () => [sheet] }),
    flush() {},
    newDataValidation: () => {
      const state = {};
      return {
        requireValueInList(values, showDropdown) {
          state.values = values;
          state.showDropdown = showDropdown;
          return this;
        },
        setAllowInvalid(allow) {
          state.allowInvalid = allow;
          return this;
        },
        build: () => state,
      };
    },
  },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: { createTextOutput: value => value },
  console: { error() {} },
});
vm.runInContext(readFileSync('apps-script/Code.gs', 'utf8'), context);
const post = order => context.doPost({ postData: { contents: JSON.stringify(order) } });
const base = {
  productId: 'MRB-ORG-5N',
  productName: 'Organizador multifuncional de 5 niveles con ruedas',
  name: 'Prueba local', whatsapp: '900000000', address: 'Dirección de prueba',
  reference: 'Referencia simulada', offer: '1 unidad · Color Negro',
  pageUrl: '/producto/organizador-5-niveles/?utm_source=prueba',
};
for (const department of ['Lima', 'Callao', 'Arequipa']) {
  for (const quantity of [1, 2]) {
    const provincial = department === 'Arequipa';
    const shippingFee = provincial ? 20 : 0;
    const order = {
      ...base, department, quantity, shippingFee, orderId: 'MRB-' + crypto.randomUUID(),
      province: department, district: department, place: department,
      total: (quantity === 2 ? 180 : 99) + shippingFee, advance: provincial ? 40 : 0,
      deliveryMethod: provincial ? 'shalom' : 'lima', dni: provincial ? '00000000' : '',
    };
    const previous = rows.length;
    assert.equal(post({ ...order, total: order.total - 1 }), 'error');
    if (provincial) assert.equal(post({ ...order, dni: '' }), 'error');
    assert.equal(post(order), 'ok');
    assert.equal(post(order), 'ok');
    assert.equal(rows.length, previous + 1);
    const row = rows.at(-1);
    const rowNumber = rows.length + 1;
    assert.equal(row[3], base.productId);
    assert.equal(row[6], quantity);
    assert.equal(row[7], order.total);
    assert(row[15].includes('Envío S/ ' + shippingFee));
    assert.equal(row[16], base.pageUrl);
    assert.equal(row[17], 'No confirmado');
    assert.deepEqual(Array.from(validations.get(`${rowNumber}:18`)?.values || []), ['Confirmado', 'No confirmado']);
  }
}
assert.equal(new Set(rowColors.values()).size, 6, 'Each of the 6 test orders should have a distinct row color');
console.log('PASS: 6 combinaciones de zona y cantidad, importes, DNI, colores distintos por pedido y seguimiento de entrega.');
