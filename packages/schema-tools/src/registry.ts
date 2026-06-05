/**
 * Load and resolve the credential registry from `schemas/registry.json`.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Registry, RegistryEntry } from './types.js';

const here = dirname(fileURLToPath(import.meta.url));

/** Repo root, resolved relative to this file (packages/schema-tools/src). */
export const REPO_ROOT = resolve(here, '..', '..', '..');

/** Absolute path to the schemas directory. */
export const SCHEMAS_DIR = join(REPO_ROOT, 'schemas');

/** Absolute path to registry.json. */
export const REGISTRY_PATH = join(SCHEMAS_DIR, 'registry.json');

/** Load and parse the registry. Throws if it is missing or malformed. */
export function loadRegistry(path: string = REGISTRY_PATH): Registry {
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw) as Registry;
}

/** Look up a single entry by id, or throw. */
export function getEntry(registry: Registry, id: string): RegistryEntry {
  const entry = registry.credentials.find((c) => c.id === id);
  if (!entry) {
    throw new Error(`No credential type with id "${id}" in registry`);
  }
  return entry;
}

/** Resolve a repo-relative path from a registry entry to an absolute path. */
export function absPath(relPath: string, repoRoot: string = REPO_ROOT): string {
  return join(repoRoot, relPath);
}

/** Load and parse a JSON artifact referenced by a repo-relative path. */
export function loadJson<T = unknown>(relPath: string, repoRoot: string = REPO_ROOT): T {
  return JSON.parse(readFileSync(absPath(relPath, repoRoot), 'utf8')) as T;
}
