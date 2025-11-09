// @ts-check

import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import rehypeResponsiveImages from './scripts/rehype-responsive-images.mjs';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://technischeservice.nl',
  output: 'server',
  adapter: cloudflare(),
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeResponsiveImages],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});