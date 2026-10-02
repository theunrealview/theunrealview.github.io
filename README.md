# The Unreal View

Web en **Vite + HTML, CSS y JavaScript vanilla**. Conserva los cuatro bloques utilizados en Hostinger y los integra con una navbar responsive. No utiliza React ni Tailwind.

## Desarrollo

Requiere Node.js 22.12 o superior.

```bash
npm install
npm run dev
```

Para revisar la versión final:

```bash
npm run build
npm run check
npm run preview
```

## Dónde editar

- `src/components/compare.html`: comparación de contenidos y Visualizador.
- `src/components/demo.html`: demo interactiva. Su proporción mobile es **3:6**, como en el código proporcionado.
- `src/components/details.html`: cómo funciona y qué incluye.
- `src/components/pricing.html`: precio, condiciones y botones de WhatsApp.
- `src/styles/components.css`: estilos extraídos de los bloques originales.
- `src/styles/site.css`: identidad común, navbar, hero, integración y ajustes responsive.
- `src/main.js`: menú mobile, animaciones de entrada y acceso a la demo.
- `scripts/generate-pages.mjs`: contenido del hero, navbar, footer y SEO de ambas páginas.
- `public/img`: logos, favicon e imágenes para compartir.

Los archivos `index.html`, `404.html`, la página de precio, `robots.txt` y `sitemap.xml` se generan antes de desarrollar o compilar. Editar los componentes y el generador, no esos archivos generados. Si cambiás un componente durante el desarrollo, reiniciá `npm run dev` para regenerar el HTML.

La demo se carga desde `https://theunrealview.github.io/showcase-light/`. Sus botones e imágenes internos pertenecen a ese proyecto; esta web controla el marco y las dimensiones del iframe.

## Publicar en GitHub Pages

1. Subir los archivos del proyecto, incluido `package-lock.json`, a la rama `main` de `theunrealview/theunrealview.github.io`.
2. En **Settings → Pages → Build and deployment**, elegir **GitHub Actions**.
3. Ejecutar el workflow **Deploy website to GitHub Pages** o subir un commit a `main`.

El workflow compila, verifica y publica **`dist/`**. Nunca hay que publicar directamente las fuentes de Vite.

Por defecto está configurado para `https://theunrealview.github.io/`, con la página de precio en `/precio-del-visualizador-de-proyectos-arquitectonicos/`. Son dos documentos HTML reales; abrir la URL del precio directamente funciona sin un router JavaScript.

### Dominio propio

Cuando decidas migrar `theunrealview.com` desde Hostinger, configurar en **Settings → Secrets and variables → Actions → Variables**:

```text
SITE_URL=https://theunrealview.com
```

Configurar también el dominio personalizado en **Settings → Pages** y los registros DNS indicados por GitHub. Volver a ejecutar el workflow para actualizar canonical, Open Graph, robots, sitemap y datos estructurados. Este proyecto no cambia el DNS ni la web de Hostinger automáticamente.

Para compilar localmente con otro dominio, copiar `.env.example` a `.env` y cambiar `SITE_URL`. Para un repositorio publicado bajo una subcarpeta, usar por ejemplo `SITE_URL=https://usuario.github.io/mi-web/`; el prefijo se deduce de esa URL. `BASE_PATH` permite especificarlo explícitamente.

## SEO y vista previa social

Cada página incluye en el HTML inicial: título, descripción, canonical, idioma, Open Graph, Twitter Card y JSON-LD. Se generan además sitemap y robots. Las imágenes `og-home.png` y `og-price.png` son PNG de 1200 × 630 px y tienen una URL absoluta basada en `SITE_URL`.

Las fuentes Poppins se sirven desde la propia web mediante `@fontsource/poppins`, sin depender de Google Fonts al cargar la página. Las únicas peticiones externas necesarias son la demo incrustada y los enlaces de WhatsApp al usarlos.

Las vistas previas sociales requieren que el dominio y las imágenes estén publicados y accesibles. Las plataformas pueden conservar una vista previa antigua en caché; los metadatos no garantizan una posición en buscadores ni una actualización inmediata de esas cachés.

Para regenerar las imágenes sociales: instalar Pillow en un entorno Python y ejecutar `python scripts/create-social-images.py` después de `npm install`. El script utiliza las fuentes Poppins locales de Fontsource. Los PNG finales ya están incluidos y esta herramienta no es necesaria para compilar o publicar.
