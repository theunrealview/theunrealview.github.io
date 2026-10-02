import { loadEnv } from 'vite';

export function siteConfig(mode = 'production') {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const url = new URL(env.SITE_URL || 'https://theunrealview.github.io');
  if (!['https:', 'http:'].includes(url.protocol) || url.search || url.hash) {
    throw new Error('SITE_URL debe ser una URL HTTP(S) sin parámetros ni fragmentos.');
  }
  const base = `/${(env.BASE_PATH || url.pathname).replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  return { base, origin: url.origin, siteUrl: `${url.origin}${base}` };
}
