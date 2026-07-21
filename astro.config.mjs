// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Required for canonical URLs, Open Graph tags, and (once added) sitemaps.
  // NOTE: the /api/bookings and /api/health routes use `export const
  // prerender = false` for on-demand rendering. To build/deploy this site
  // you need a server adapter, e.g.:
  //   npx astro add node
  // then set `output: 'server'` (or 'hybrid') here. Without an adapter,
  // `astro build` will fail on those routes.
  site: 'https://rajubhaitravels.com',

  adapter: cloudflare()
});