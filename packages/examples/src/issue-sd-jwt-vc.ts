/**
 * Issue an SD-JWT VC (decoded form).
 *
 * Takes a flat claim set plus the set of claim names that should be selectively disclosable,
 * and produces the issuer-signed payload (`_sd` digests + `_sd_alg`) and the matching
 * Disclosure strings. Signing the payload into a JWS is out of scope here — that is a key-
 * management step layered on top per draft-ietf-oauth-sd-jwt-vc-16.
 */
// #region issue
import { SD_ALG, makeObjectDisclosure } from '@fido/schema-tools';

export interface IssueInput {
  iss: string;
  vct: string;
  /** Holder key for key binding (`cnf`). */
  cnf: Record<string, unknown>;
  iat: number;
  exp?: number;
  /** All credential claims. */
  claims: Record<string, unknown>;
  /** Which claim names to make selectively disclosable. The rest stay in cleartext. */
  selectivelyDisclosable: string[];
}

export interface IssuedSdJwtVc {
  payload: Record<string, unknown>;
  disclosures: Array<{ encoded: string; claim: string }>;
}

export function issueSdJwtVc(input: IssueInput): IssuedSdJwtVc {
  const sd: string[] = [];
  const disclosures: Array<{ encoded: string; claim: string }> = [];
  const payload: Record<string, unknown> = {
    iss: input.iss,
    vct: input.vct,
    iat: input.iat,
    ...(input.exp !== undefined ? { exp: input.exp } : {}),
    cnf: input.cnf,
    _sd_alg: SD_ALG,
  };

  for (const [claim, value] of Object.entries(input.claims)) {
    if (input.selectivelyDisclosable.includes(claim)) {
      const { disclosure, digest } = makeObjectDisclosure(claim, value);
      sd.push(digest);
      disclosures.push({ encoded: disclosure, claim });
    } else {
      payload[claim] = value; // always-visible claim
    }
  }

  payload._sd = sd.sort(); // sorted so order leaks nothing
  return { payload, disclosures };
}
// #endregion issue

// Demo when run directly.
if (import.meta.url === `file://${process.argv[1]}`) {
  const issued = issueSdJwtVc({
    iss: 'https://issuer.fido.example',
    vct: 'https://schemas.fido.example/vct/age-verification',
    cnf: { jwk: { kty: 'EC', crv: 'P-256', x: '…', y: '…' } },
    iat: 1768467600,
    exp: 1800003600,
    claims: { birthdate: '2000-05-17', age_over_18: true, age_over_21: true },
    selectivelyDisclosable: ['birthdate', 'age_over_18', 'age_over_21'],
  });
  console.log(JSON.stringify(issued, null, 2));
}
