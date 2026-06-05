/**
 * Build-time content loader for the site.
 *
 * Everything the UI renders about credential types is derived here from the registry and the
 * on-disk schema artifacts — the UI never hardcodes a schema list. Runs in Node during the
 * Astro build, so synchronous fs access is fine.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  loadRegistry,
  absPath,
  REPO_ROOT,
  type Registry,
  type RegistryEntry,
  type VctMetadata,
} from '@fido/schema-tools';

export type { RegistryEntry } from '@fido/schema-tools';

export interface ClaimRow {
  name: string;
  type: string;
  required: boolean;
  disclosable: string; // "always" | "allowed" | "never" | "—"
  notes: string;
}

export interface CredentialDetail {
  entry: RegistryEntry;
  claims: ClaimRow[];
  schema: string;
  jsonldExample: string;
  jsonldContext: string;
  sdJwtExample: string;
  vctMetadata: string;
  readme: string;
}

interface JsonSchema {
  properties?: Record<
    string,
    { type?: string; format?: string; enum?: string[]; description?: string }
  >;
  required?: string[];
}

export function getRegistry(): Registry {
  return loadRegistry();
}

function raw(relPath: string): string {
  return readFileSync(absPath(relPath), 'utf8').trimEnd();
}

function typeLabel(p: { type?: string; format?: string; enum?: string[] }): string {
  if (p.enum) return `enum(${p.enum.join(' | ')})`;
  if (p.format) return `${p.type ?? 'string'} <${p.format}>`;
  return p.type ?? 'any';
}

export function getDetail(id: string): CredentialDetail {
  const registry = loadRegistry();
  const entry = registry.credentials.find((c) => c.id === id);
  if (!entry) throw new Error(`Unknown credential id: ${id}`);

  const schema = JSON.parse(raw(entry.paths.schema)) as JsonSchema;
  const vctMeta = JSON.parse(raw(entry.paths.sdJwtVcMetadata)) as VctMetadata;

  const sdByClaim = new Map<string, string>();
  for (const c of vctMeta.claims ?? []) {
    const key = c.path[0];
    if (typeof key === 'string' && c.sd) sdByClaim.set(key, c.sd);
  }

  const required = new Set(schema.required ?? []);
  const claims: ClaimRow[] = Object.entries(schema.properties ?? {}).map(([name, p]) => ({
    name,
    type: typeLabel(p),
    required: required.has(name),
    disclosable: sdByClaim.get(name) ?? '—',
    notes: p.description ?? '',
  }));

  return {
    entry,
    claims,
    schema: raw(entry.paths.schema),
    jsonldExample: raw(entry.paths.jsonldExample),
    jsonldContext: raw(entry.paths.jsonldContext),
    sdJwtExample: raw(entry.paths.sdJwtVcExample),
    vctMetadata: raw(entry.paths.sdJwtVcMetadata),
    readme: raw(entry.paths.readme),
  };
}

/** Extract a `// #region <name>` … `// #endregion` block from an examples source file. */
export function snippet(relFromRepo: string, region: string): string {
  const src = readFileSync(join(REPO_ROOT, relFromRepo), 'utf8');
  const lines = src.split('\n');
  const start = lines.findIndex((l) => l.includes(`#region ${region}`));
  const end = lines.findIndex((l) => l.includes(`#endregion ${region}`));
  if (start === -1 || end === -1) throw new Error(`Region ${region} not found in ${relFromRepo}`);
  return lines
    .slice(start + 1, end)
    .join('\n')
    .trimEnd();
}
