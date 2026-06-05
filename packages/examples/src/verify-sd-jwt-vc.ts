/**
 * Verify the Disclosures in an SD-JWT VC presentation and reconstruct the disclosed claim set.
 *
 * A real verifier also checks the issuer's JWS signature, `vct`, validity window, and key
 * binding. Here we focus on the selective-disclosure mechanic: every presented Disclosure's
 * digest MUST appear in the payload `_sd`, and the result is the union of cleartext payload
 * claims and disclosed claims.
 */
// #region verify
import { digest, parseDisclosure } from '@fido/schema-tools';

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
]);

export interface VerifyResult {
  ok: boolean;
  claims: Record<string, unknown>;
  errors: string[];
}

export function verify(payload: Record<string, unknown>, disclosures: string[]): VerifyResult {
  const errors: string[] = [];
  const sdDigests = new Set((payload._sd as string[] | undefined) ?? []);
  const claims: Record<string, unknown> = {};

  // Cleartext (non-registered) claims are always present.
  for (const [k, v] of Object.entries(payload)) {
    if (!REGISTERED.has(k)) claims[k] = v;
  }

  // Each disclosure must hash to a digest the issuer signed into `_sd`.
  for (const d of disclosures) {
    if (!sdDigests.has(digest(d))) {
      errors.push(`Disclosure not found in _sd: ${d}`);
      continue;
    }
    const [, claim, value] = parseDisclosure(d);
    claims[claim] = value;
  }

  return { ok: errors.length === 0, claims, errors };
}
// #endregion verify

if (import.meta.url === `file://${process.argv[1]}`) {
  // Re-issue + present, then verify the presentation.
  const { issueSdJwtVc } = await import('./issue-sd-jwt-vc.js');
  const { present } = await import('./selective-disclosure.js');
  const issued = issueSdJwtVc({
    iss: 'https://issuer.fido.example',
    vct: 'https://schemas.fido.example/vct/age-verification',
    cnf: { jwk: { kty: 'EC', crv: 'P-256', x: '…', y: '…' } },
    iat: 1768467600,
    claims: { birthdate: '2000-05-17', age_over_18: true, age_over_21: true },
    selectivelyDisclosable: ['birthdate', 'age_over_18', 'age_over_21'],
  });
  const vp = present(issued, ['age_over_18']);
  const result = verify(vp.payload, vp.disclosures);
  console.log('Verified:', result.ok);
  console.log('Disclosed claims:', result.claims);
}
