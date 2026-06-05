import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Base path is overridable so the site can deploy to a project Pages path (e.g. /pocs)
// or a custom domain root. CI sets SITE_BASE; default to root for local dev.
const base = process.env.SITE_BASE ?? '/';
const site = process.env.SITE_URL ?? 'https://glideidentity.github.io';

// https://astro.build
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [tailwind()],
});
