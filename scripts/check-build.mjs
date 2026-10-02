import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { siteConfig } from './site-config.mjs';

const { base, siteUrl } = siteConfig();
const slug = 'precio-del-visualizador-de-proyectos-arquitectonicos/';
const pages = ['index.html', `${slug}index.html`, '404.html'];
for (const page of pages) {
  const html = await readFile(join('dist', page), 'utf8');
  assert.match(html, /<html lang="es-AR">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page}: debe tener exactamente un H1`);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  const expectedUrl = siteUrl + (page === 'index.html' ? '' : page === '404.html' ? page : slug);
  assert.ok(html.includes(`<link rel="canonical" href="${expectedUrl}">`), `${page}: canonical incorrecto`);
  assert.ok(!html.includes('DM Serif') && !html.includes('fonts.googleapis.com'), 'La fuente debe ser Poppins local');
  assert.ok(!html.includes('document.currentScript'), 'Los embeds deben usar el módulo de inicialización');
  for (const data of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(data[1]);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.ok(schema['@graph'].length >= 3);
  }
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:)/.test(target) || target.startsWith('#')) continue;
    assert.ok(target.startsWith(base), `${page}: ruta fuera de BASE_PATH: ${target}`);
    const path = decodeURIComponent(target.slice(base.length).split('#')[0]);
    const file = path === '' || path.endsWith('/') ? `${path}index.html` : path;
    await access(join('dist', file));
    if (target.includes('#')) {
      const id = target.split('#')[1];
      const destination = await readFile(join('dist', file), 'utf8');
      assert.ok(destination.includes(`id="${id}"`), `Ancla inexistente: ${target}`);
    }
  }
  if (page.includes(slug)) {
    assert.ok(html.includes('$100.000') && html.includes('24–48 h*'));
    assert.equal((html.match(/href="https:\/\/wa.me\/message\/2IGP3T2UX64EN1"/g) || []).length, 4);
    assert.match(html, /<h1 class="tuv-price-title">/);
  }
}
for (const name of ['og-home', 'og-price']) {
  const png = await readFile(`dist/img/${name}.png`);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.ok(sitemap.includes(`<loc>${siteUrl}</loc>`) && sitemap.includes(`<loc>${siteUrl}${slug}</loc>`));
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes(`${siteUrl}sitemap.xml`));
console.log('OK: páginas estáticas, H1, SEO, datos estructurados, rutas, WhatsApp e imágenes sociales 1200 × 630.');
