/**
 * Configurable bases for `vct` and `@context` URLs.
 *
 * A fork repoints the whole registry by setting these env vars; nothing in the codebase
 * should hardcode the production URLs.
 */

export const DEFAULT_CONTEXT_BASE = 'https://schemas.glideidentity.app/contexts/';
export const DEFAULT_VCT_BASE = 'https://schemas.glideidentity.app/vct/';

export interface Bases {
  contextBase: string;
  vctBase: string;
}

/** Read bases from the environment, falling back to Glide defaults. */
export function resolveBases(env: Record<string, string | undefined> = process.env): Bases {
  return {
    contextBase: ensureTrailingSlash(env.GLIDE_CONTEXT_BASE ?? DEFAULT_CONTEXT_BASE),
    vctBase: ensureTrailingSlash(env.GLIDE_VCT_BASE ?? DEFAULT_VCT_BASE),
  };
}

/** The SD-JWT VC `vct` for a credential type id. */
export function vctFor(id: string, bases: Bases): string {
  return `${bases.vctBase}${id}`;
}

/** The JSON-LD context URL for a credential type id. */
export function contextFor(id: string, bases: Bases): string {
  return `${bases.contextBase}${id}.jsonld`;
}

function ensureTrailingSlash(s: string): string {
  return s.endsWith('/') ? s : `${s}/`;
}
