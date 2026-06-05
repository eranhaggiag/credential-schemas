/**
 * CI gate: every example MUST validate against its credential type's `schema.json`.
 *
 * For each registered type we extract the *claim set* from both representations and validate
 * it against the shared schema:
 *   - W3C VC 2.0: `credentialSubject` (minus the subject `id`).
 *   - SD-JWT VC: the issuer-signed payload's non-registered claims, plus every disclosed
 *     {claim: value}. (Registered JWT / SD-JWT claims are stripped.)
 *
 * Run: `pnpm validate`. Exits non-zero on any failure.
 */
import { readFileSync } from 'node:fs';
import {
  createAjv,
  formatErrors,
  loadRegistry,
  absPath,
  validate,
  type Registry,
} from '../packages/schema-tools/src/index.js';

/** JWT / SD-JWT registered claims that are not part of the credential's claim set. */
const REGISTERED = new Set([
  'iss',
  'sub',
  'aud',
  'exp',
  'nbf',
  'iat',
  'jti',
  'vct',
  'cnf',
  'status',
  '_sd',
  '_sd_alg',
  '...',
]);

interface JsonLdExample {
  credentialSubject: Record<string, unknown>;
}

interface SdJwtExample {
  issuerSignedPayload: Record<string, unknown>;
  disclosures: Array<{ claim: string; value: unknown }>;
}

function claimSetFromJsonLd(ex: JsonLdExample): Record<string, unknown> {
  const { id: _id, ...claims } = ex.credentialSubject;
  void _id;
  return claims;
}

function claimSetFromSdJwt(ex: SdJwtExample): Record<string, unknown> {
  const claims: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(ex.issuerSignedPayload)) {
    if (!REGISTERED.has(k)) claims[k] = v;
  }
  for (const d of ex.disclosures) {
    claims[d.claim] = d.value;
  }
  return claims;
}

function main(): void {
  const registry: Registry = loadRegistry();
  const ajv = createAjv();
  let failures = 0;
  let checks = 0;

  for (const entry of registry.credentials) {
    const schema = JSON.parse(readFileSync(absPath(entry.paths.schema), 'utf8')) as object;
    const jsonld = JSON.parse(
      readFileSync(absPath(entry.paths.jsonldExample), 'utf8'),
    ) as JsonLdExample;
    const sdjwt = JSON.parse(
      readFileSync(absPath(entry.paths.sdJwtVcExample), 'utf8'),
    ) as SdJwtExample;

    for (const [label, claimSet] of [
      ['JSON-LD', claimSetFromJsonLd(jsonld)],
      ['SD-JWT VC', claimSetFromSdJwt(sdjwt)],
    ] as const) {
      checks += 1;
      const result = validate(schema, claimSet, ajv);
      if (result.valid) {
        console.log(`  ✓ ${entry.id} [${label}]`);
      } else {
        failures += 1;
        console.error(`  ✗ ${entry.id} [${label}]`);
        console.error(formatErrors(result.errors));
      }
    }
  }

  console.log(`\n${checks - failures}/${checks} example checks passed.`);
  if (failures > 0) {
    console.error(`${failures} validation failure(s).`);
    process.exit(1);
  }
}

main();
