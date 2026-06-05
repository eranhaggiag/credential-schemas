/**
 * Shared types for the FIDO Alliance credential schema registry.
 *
 * The registry is the single machine-readable index of every credential type and the
 * paths to its dual-format artifacts (W3C VC 2.0 JSON-LD + IETF SD-JWT VC).
 */

/** A single credential type entry in `schemas/registry.json`. */
export interface RegistryEntry {
  /** Stable kebab-case identifier, e.g. `age-verification`. Matches the folder name. */
  id: string;
  /** Human-readable name, e.g. "Age Verification". */
  name: string;
  /** One-line description. */
  description: string;
  /** Semantic version of this schema definition. */
  version: string;
  /** The SD-JWT VC type identifier (`vct`), resolved from `vctBase` + id. */
  vct: string;
  /** The JSON-LD context URL, resolved from `contextBase` + id + `.jsonld`. */
  context: string;
  /** Spec versions this type targets. */
  specs: {
    w3cVcDataModel: string;
    sdJwtVc: string;
    sdJwt: string;
    jsonSchema: string;
  };
  /** Repo-relative paths to the artifacts for this type. */
  paths: {
    schema: string;
    jsonldContext: string;
    jsonldExample: string;
    sdJwtVcMetadata: string;
    sdJwtVcExample: string;
    readme: string;
  };
}

/** The full registry document. */
export interface Registry {
  $comment: string;
  /** Schema-registry format version (not a credential version). */
  registryVersion: string;
  /** When this registry file was generated (ISO 8601). */
  generatedAt: string;
  /** Configurable bases; forks repoint these. */
  bases: {
    contextBase: string;
    vctBase: string;
  };
  /** Spec versions targeted across the registry. */
  specs: {
    w3cVcDataModel: string;
    sdJwtVc: string;
    sdJwt: string;
    jsonSchema: string;
  };
  /** All credential types, ordered as authored. */
  credentials: RegistryEntry[];
}

/** Disclosability of a claim in the SD-JWT VC type metadata. */
export type Disclosability = 'always' | 'allowed' | 'never';

/** A claim entry inside an SD-JWT VC Type Metadata document (draft-16, section "claims"). */
export interface VctMetadataClaim {
  /** JSON pointer-ish path array, e.g. ["address", "locality"]. */
  path: (string | null)[];
  /** `always` (issuer must make selectively disclosable), `allowed`, or `never`. */
  sd?: Disclosability;
  /** Localized display metadata. */
  display?: Array<{ lang: string; label: string; description?: string }>;
  /** SVG template id for rendering. */
  svg_id?: string;
}

/** Minimal shape of an SD-JWT VC Type Metadata document we author (draft-ietf-oauth-sd-jwt-vc-16). */
export interface VctMetadata {
  $comment?: string;
  vct: string;
  name?: string;
  description?: string;
  extends?: string;
  display?: Array<{
    lang: string;
    name: string;
    description?: string;
  }>;
  claims?: VctMetadataClaim[];
  /** Embedded JSON Schema, or use `schema_uri`. */
  schema?: Record<string, unknown>;
  schema_uri?: string;
}
