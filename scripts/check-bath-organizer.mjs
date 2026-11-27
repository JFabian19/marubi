import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('dist/producto/organizador-para-bano-de-metal/index.html','utf8');
for(const m of html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) assert(existsSync('dist'+m[1]),m[1]);
const source=readFileSync('src/lib/organizerLanding.js','utf8');
const entry=readFileSync('src/organizadorBano.js','utf8');
for (const quantity of [1,2]) for(const department of ['Lima','Arequipa']) {
 const nodes=new Map(), orders=[], events=[];
 const make=()=>({value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},listeners:{},addEventListener(n,fn){const previous=this.listeners[n];this.listeners[n]=(...args)=>{previous?.(...args);return fn(...args)}},setAttribute(){},hasAttribute(){return false},appendChild(){},closest(){return {hidden:false}},querySelector(){return {scrollTop:0}},showModal(){this.open=true},close(){this.open=false},focus(){},reset(){},setCustomValidity(){},reportValidity(){},scrollIntoView(){}});
 const get=s=>{if(s==='#exitDiscountPopup')return null;if(!nodes.has(s))nodes.set(s,make());return nodes.get(s)};
 const bundleCards=[1,2].map(n=>Object.assign(make(),{dataset:{bundleQty:String(n)}}));
 const buy=Object.assign(make(),{dataset:{openCheckout:String(quantity)}});
 const document={querySelector:get,querySelectorAll:s=>s==='[data-bundle-qty]'?bundleCards:s==='[data-open-checkout]'?[buy]:[],createElement:make,body:make()};
 const window={location:{href:'http://local/producto/organizador-para-bano-de-metal'},scrollY:0,scrollTo(){},setTimeout:fn=>fn()};
 const context=vm.createContext({document,window,console,PROVINCIAL_SHIPPING_FEE:10,PROVINCIAL_ADVANCE:40,provincialDeliveryNote:'Envío S/10',PERU_LOCATIONS:{Lima:{Lima:['Miraflores']},Arequipa:{Arequipa:['Arequipa']}},usesShalom:d=>!!d&&d!=='Lima'&&d!=='Callao',trackMetaEvent:(...a)=>events.push(a),updateMetaUserData(){},createOrderId:()=>`test-${quantity}-${department}`,saveOrder:async o=>orders.push(o),initPixel(){},initEngagementTracking(){}});
 vm.runInContext("function formatSoles(amount){return `S/. ${Number(amount||0).toFixed(2)}`;}\n"+source.slice(source.indexOf('export function initOrganizerCheckout')).replace('export function','function'),context);
 vm.runInContext(entry.replace(/^import .*;\r?\n/gm,''),context);
 buy.listeners.click();
 get('#drawerProvincia').value=department;get('#drawerProvincia').listeners.change();
 assert.equal(get('#codTotal').textContent,quantity===1?'S/. 69.00':'S/. 104.00');
 assert.equal(get('#codShippingTotal').textContent,'Gratis');
 if(department==='Arequipa'){assert.match(get('#deliveryNote').textContent,/gratis/);assert.equal(get('#codShippingMethod').textContent,'Envío por Shalom');}
 for(const [s,v] of Object.entries({'#drawerNombre':'Cliente Prueba','#drawerWhatsapp':'900000000','#drawerDireccion':'Direccion simulada 123','#drawerReferencia':'Prueba local','#drawerCiudad':'Centro','#drawerDni':'12345678'}))get(s).value=v;
 await get('#drawerOrderForm').listeners.submit({preventDefault(){}});
 assert.equal(orders.length,1);assert.equal(orders[0].shippingFee,0);assert.equal(orders[0].total,quantity===1?69:104);assert.equal(orders[0].productId,'MRB-BANO-METAL');
 assert(events.some(([name,p])=>name==='Purchase'&&p.value===orders[0].total));
 assert.match(decodeURIComponent(window.location.href), department==='Arequipa'?/Envío gratis por Shalom/:/Envío S\/\. 0.00/);
}
console.log('PASS: assets, checkout opening, 1/2 kits, Lima/province totals, free shipping, saved payload, WhatsApp and Meta Purchase (all mocked).');

