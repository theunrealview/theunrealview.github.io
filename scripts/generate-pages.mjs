import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { siteConfig } from './site-config.mjs';

const { base, siteUrl } = siteConfig(process.argv.includes('--development') ? 'development' : 'production');
const slug = 'precio-del-visualizador-de-proyectos-arquitectonicos/';
const pricePath = `${base}${slug}`;
const whatsapp = 'https://wa.me/message/2IGP3T2UX64EN1';
const component = (name) => readFile(`src/components/${name}.html`, 'utf8');
const [compare, demo, details, pricing] = await Promise.all(['compare', 'demo', 'details', 'pricing'].map(component));
const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

function header(page) {
  return `<a class="skip-link" href="#contenido">Ir al contenido</a>
  <header class="site-header">
    <div class="nav-bar">
      <a class="brand" href="${base}" aria-label="The Unreal View — Inicio">
        <img src="${base}img/logo-hr.webp" width="2323" height="388" alt="The Unreal View" fetchpriority="high">
      </a>
      <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="site-navigation" hidden>
        <span></span><span></span>
      </button>
      <nav class="site-nav" id="site-navigation" aria-label="Navegación principal">
        <a href="${base}#demo">Demo</a>
        <a href="${base}#como-funciona">Cómo funciona</a>
        <a href="${pricePath}" ${page === 'price' ? 'aria-current="page"' : ''}>Precio</a>
        <a class="nav-contact" href="${whatsapp}" target="_blank" rel="noopener noreferrer">Consultas</a>
        <a class="button button-primary nav-cta" href="${pricePath}">Contratar <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="${base}" aria-label="The Unreal View — Inicio"><img src="${base}img/logo-hr.webp" width="2323" height="388" alt="The Unreal View" loading="lazy"></a>
        <p>Tu proyecto. Una sola experiencia.</p>
      </div>
      <nav aria-label="Navegación del pie de página">
        <a href="${base}#demo">Explorar demo</a>
        <a href="${pricePath}">Precio del Visualizador</a>
        <a href="${whatsapp}" target="_blank" rel="noopener noreferrer">Hablemos de tu proyecto ↗</a>
      </nav>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} The Unreal View</span><span>Visualizador de proyectos arquitectónicos.</span></div>
  </footer>`;
}

const organization = { '@type': 'Organization', '@id': `${siteUrl}#organization`, name: 'The Unreal View', url: siteUrl, logo: `${siteUrl}img/TUV%20LOGO.webp` };

function document({ page, title, description, path = '', body, noindex = false }) {
  const url = `${siteUrl}${path}`;
  const graph = [organization, { '@type': 'WebSite', '@id': `${siteUrl}#website`, url: siteUrl, name: 'The Unreal View', inLanguage: 'es-AR', publisher: { '@id': organization['@id'] } }, { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'es-AR', isPartOf: { '@id': `${siteUrl}#website` } }];
  if (page === 'price') graph.push({ '@type': 'Service', name: 'Visualizador de proyectos arquitectónicos', serviceType: 'Implementación y publicación de un Visualizador interactivo', provider: { '@id': organization['@id'] }, url, description: 'Implementación del material proporcionado por el cliente. Precio promocional para viviendas de hasta 2 plantas. No incluye producción de contenidos.', offers: { '@type': 'Offer', price: '100000', priceCurrency: 'ARS', url } });
  return `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
  <meta name="theme-color" content="#73038a">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/webp" href="${base}img/favicon.webp">
  <link rel="apple-touch-icon" href="${base}img/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_AR">
  <meta property="og:site_name" content="The Unreal View">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${siteUrl}img/${page === 'price' ? 'og-price' : 'og-home'}.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${page === 'price' ? 'Visualizador de proyectos arquitectónicos — lanzamiento: $100.000 ARS' : 'The Unreal View — Tu proyecto. Una sola experiencia.'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${siteUrl}img/${page === 'price' ? 'og-price' : 'og-home'}.png">
  <script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph })}</script>
  <script type="module" src="${base}src/main.js"></script>
</head>
<body class="page-${page}">
  ${header(page)}
  <main id="contenido">${body}</main>
  ${footer()}
</body>
</html>`;
}

const homeBody = `
  <section class="hero" aria-labelledby="hero-title">
    <p class="eyebrow"><span aria-hidden="true"></span> ARQUITECTURA, EN UN SOLO ENLACE</p>
    <h1 id="hero-title">Visualizador interactivo<br class="desktop-break"> para proyectos arquitectónicos<span class="hero-period">.</span></h1>
    <p class="hero-description">Presentá imágenes, planos, videos, tours virtuales e información de tu proyecto en una única experiencia web interactiva.</p>
    <div class="hero-actions">
      <a class="button button-primary" href="#demo">Explorar demo <span aria-hidden="true">↘</span></a>
      <a class="button button-secondary" href="${pricePath}">Ver precio de lanzamiento</a>
    </div>
  </section>
  ${compare.replace('<section ', '<section id="visualizador" ')}
  ${demo.replace('<section ', '<section id="demo" ').replace('allow="fullscreen"', 'loading="lazy" allow="fullscreen"')}
  <div class="section-intro"><p class="eyebrow">LISTO PARA RECORRER Y COMPARTIR</p><h2>Todo tu proyecto,<br>en una sola experiencia.</h2><p>Reuní imágenes, planos, videos, tours virtuales y documentación en un único espacio web.</p></div>
  ${details.replace('<section ', '<section id="como-funciona" ').replace('href="https://theunrealview.com/precio-del-visualizador-de-proyectos-arquitectonicos"', `href="${pricePath}"`).replace('target="_blank"\n      rel="noopener"', '')}
  <section class="contact-strip" aria-labelledby="contact-title"><div><p class="eyebrow">HABLEMOS DE TU PROYECTO</p><h2 id="contact-title">¿Tenés alguna consulta?</h2><p>Escribinos y contanos sobre tu proyecto.</p></div><a class="button button-secondary" href="${whatsapp}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">↗</span></a></section>`;

const priceBody = `<nav class="breadcrumb" aria-label="Ubicación"><a href="${base}">Inicio</a><span aria-hidden="true">/</span><span>Contratar Visualizador</span></nav>${pricing.replace('<h2 class="tuv-price-title">', '<h1 class="tuv-price-title">').replace('</h2>', '</h1>')}`;

await mkdir(slug, { recursive: true });
await mkdir('public', { recursive: true });
await writeFile('index.html', document({ page: 'home', title: 'Visualizador de proyectos arquitectónicos | The Unreal View', description: 'Presentá imágenes, planos, videos y tours de tu proyecto en un Visualizador interactivo. Una sola experiencia web, lista para recorrer y compartir.', body: homeBody }));
await writeFile(`${slug}index.html`, document({ page: 'price', title: 'Precio del Visualizador de proyectos arquitectónicos | The Unreal View', description: 'Visualizador interactivo desde $100.000 ARS durante el lanzamiento para viviendas de hasta 2 plantas. Implementación de tu material y un enlace para compartir.', path: slug, body: priceBody }));
await writeFile('404.html', document({ page: 'not-found', title: 'Página no encontrada | The Unreal View', description: 'Volvé al inicio para explorar el Visualizador de proyectos arquitectónicos.', path: '404.html', noindex: true, body: `<section class="not-found"><p class="eyebrow">404</p><h1>Esta página no está disponible.</h1><p>Podés volver al inicio o explorar nuestra demo.</p><a class="button button-primary" href="${base}">Volver al inicio ↗</a></section>` }));
await writeFile('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url><url><loc>${siteUrl}${slug}</loc></url></urlset>\n`);
console.log(`Páginas y SEO generados para ${siteUrl}`);
