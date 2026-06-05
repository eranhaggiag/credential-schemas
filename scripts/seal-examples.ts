/**
 * "Seal" every SD-JWT VC example: compute each Disclosure's base64url encoding and digest
 * from its authored {salt, claim, value}, populate the issuer-signed payload `_sd` array,
 * and write a combined issuance serialization. Idempotent — same inputs produce same output.
 *
 * This keeps the committed examples cryptographically self-consistent (RFC 9901) without
 * anyone hand-computing SHA-256. Run: `pnpm seal`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import {
  SD_ALG,
  base64url,
  digest,
  loadRegistry,
  absPath,
  type Registry,
} from '../packages/schema-tools/src/index.js';

interface AuthoredDisclosure {
  salt: string;
  claim: string;
  value: unknown;
  encoded?: string;
  digest?: string;
}

interface SdJwtExample {
  sealed?: boolean;
  issuerSignedPayload: Record<string, unknown> & {
    _sd?: string[];
    _sd_alg?: string;
  };
  disclosures: AuthoredDisclosure[];
  combinedIssuance?: string;
  [k: string]: unknown;
}

function seal(example: SdJwtExample): SdJwtExample {
  const disclosures = example.disclosures.map((d) => {
    const encoded = base64url(JSON.stringify([d.salt, d.claim, d.value]));
    return { ...d, encoded, digest: digest(encoded) };
  });

  // `_sd` digests are sorted (the spec recommends not leaking order/structure).
  const sd = disclosures.map((d) => d.digest).sort();

  const payload = { ...example.issuerSignedPayload, _sd_alg: SD_ALG, _sd: sd };

  // Illustrative combined serialization: <jwt>~<disclosure>~...~  (issuer-signed JWT elided).
  const combinedIssuance = `<issuer-signed-jwt>~${disclosures.map((d) => d.encoded).join('~')}~`;

  return {
    ...example,
    sealed: true,
    issuerSignedPayload: payload,
    disclosures,
    combinedIssuance,
  };
}

function main(): void {
  const registry: Registry = loadRegistry();
  let count = 0;
  for (const entry of registry.credentials) {
    const path = absPath(entry.paths.sdJwtVcExample);
    const example = JSON.parse(readFileSync(path, 'utf8')) as SdJwtExample;
    const sealed = seal(example);
    writeFileSync(path, `${JSON.stringify(sealed, null, 2)}\n`, 'utf8');
    count += 1;
  }
  console.log(`Sealed ${count} SD-JWT VC example(s).`);
}

main();
