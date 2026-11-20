import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync('src/organizador.js', 'utf8');
const markup = readFileSync('producto/organizador-de-plantas-6-niveles/index.html', 'utf8');
const images = [...markup.matchAll(/<img\b[^>]*data-product-image="([^"]+)"[^>]*>/g)].map(match => ({
  dataset: { productImage: match[1], description: 'Product information' },
  classList: { contains: name => name === 'cod-bundle-img' && match[0].includes('class="cod-bundle-img"') },
}));
const caption = {}, position = {};
const context = vm.createContext({ document: {
  querySelectorAll: () => images,
  querySelector: selector => ({ '#hero-photo': images[0], '#gallery-caption': caption, '#gallery-position': position })[selector],
} });
vm.runInContext(source.slice(source.indexOf('const scenes = ['), source.indexOf("document.querySelector('#gallery-prev')")), context);
for (const color of ['Blanco', 'Negro', 'Blanco']) {
  vm.runInContext(`selectedColor = '${color}'; syncProductColorImages();`, context);
  for (const image of images) {
    assert(image.src.endsWith('.webp'));
    assert(image.src.includes(`-${color.toLowerCase()}-`));
    assert(existsSync(`public${image.src}`), image.src);
    if (image.srcset) {
      for (const candidate of image.srcset.split(', ')) assert(existsSync(`public${candidate.split(' ')[0]}`));
    }
  }
  for (let step = 0; step < 3; step++) {
    vm.runInContext('showScene(1)', context);
    assert(images[0].srcset.includes('720w'));
    assert(images[0].src.includes(`-${color.toLowerCase()}-`));
    assert(existsSync(`public${images[0].src}`));
  }
  assert.equal(position.textContent, '1 / 3');
  assert.equal(images.find(image => image.dataset.productImage === 'ficha').dataset.productImage, 'ficha');
}
assert(!markup.includes('organizador-plantas/sala-blanco.png'));
console.log(`PASS: ${images.length} product images, both colors, responsive assets, gallery wrap and retained infographic.`);
