import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { siteConfig } from './scripts/site-config.mjs';

export default defineConfig(({ mode }) => ({
  base: siteConfig(mode).base,
  build: {
    rollupOptions: {
      input: {
        home: resolve('index.html'),
        price: resolve('precio-del-visualizador-de-proyectos-arquitectonicos/index.html'),
        notFound: resolve('404.html'),
      },
    },
  },
}));
