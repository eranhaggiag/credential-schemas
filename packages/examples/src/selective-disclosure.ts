/**
 * Build a selective-disclosure *presentation* from an issued SD-JWT VC.
 *
 * The holder keeps the issuer-signed payload intact and chooses which Disclosures to send.
 * Withheld disclosures simply aren't included — the verifier still sees their digests in
 * `_sd` but cannot learn the values. This is how a holder presents only `age_over_18`.
 */
// #region present
import { parseDisclosure } from '@glide/schema-tools';
import { issueSdJwtVc, type IssuedSdJwtVc } from './issue-sd-jwt-vc.js';

export interface Presentation {
  payload: Record<string, unknown>;
  /** Only the Disclosures the holder chose to reveal. */
  disclosures: string[];
  /** Combined serialization: <jwt>~<disclosure>~…~ (JWS elided in this teaching example). */
  combined: string;
}

/** Present only the named claims; everything else stays hidden. */
export function present(issued: IssuedSdJwtVc, reveal: string[]): Presentation {
  const disclosures = issued.disclosures
    .filter((d) => reveal.includes(d.claim))
    .map((d) => d.encoded);
  return {
    payload: issued.payload,
    disclosures,
    combined: `<issuer-signed-jwt>~${disclosures.join('~')}~`,
  };
}
// #endregion present

if (import.meta.url === `file://${process.argv[1]}`) {
  const issued = issueSdJwtVc({
    iss: 'https://issuer.glideidentity.app',
    vct: 'https://schemas.glideidentity.app/vct/age-verification',
    cnf: { jwk: { kty: 'EC', crv: 'P-256', x: '…', y: '…' } },
    iat: 1768467600,
    claims: { birthdate: '2000-05-17', age_over_18: true, age_over_21: true },
    selectivelyDisclosable: ['birthdate', 'age_over_18', 'age_over_21'],
  });

  const vp = present(issued, ['age_over_18']);
  console.log('Revealed disclosures:');
  for (const d of vp.disclosures) console.log('  ', parseDisclosure(d));
  console.log(
    `Withheld ${issued.disclosures.length - vp.disclosures.length} claim(s) — birthdate stays private.`,
  );
}
