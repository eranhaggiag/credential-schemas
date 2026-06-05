/**
 * Run the full lifecycle for the Age Verification type: issue → present (age_over_18 only) →
 * verify. Exits non-zero if verification fails or if birthdate leaks into the presentation.
 */
import { issueSdJwtVc } from './issue-sd-jwt-vc.js';
import { present } from './selective-disclosure.js';
import { verify } from './verify-sd-jwt-vc.js';

const issued = issueSdJwtVc({
  iss: 'https://issuer.fido.example',
  vct: 'https://schemas.fido.example/vct/age-verification',
  cnf: { jwk: { kty: 'EC', crv: 'P-256', x: '…', y: '…' } },
  iat: 1768467600,
  exp: 1800003600,
  claims: {
    birthdate: '2000-05-17',
    age_over_13: true,
    age_over_18: true,
    age_over_21: true,
  },
  selectivelyDisclosable: ['birthdate', 'age_over_13', 'age_over_18', 'age_over_21'],
});

const vp = present(issued, ['age_over_18']);
const result = verify(vp.payload, vp.disclosures);

console.log('issued disclosures :', issued.disclosures.map((d) => d.claim).join(', '));
console.log('presented          :', Object.keys(result.claims).join(', ') || '(none)');
console.log('verified           :', result.ok);

if (!result.ok) {
  console.error('Verification failed:', result.errors);
  process.exit(1);
}
if ('birthdate' in result.claims) {
  console.error('Privacy failure: birthdate leaked into a predicate-only presentation.');
  process.exit(1);
}
console.log('\nOK — proved age_over_18 without revealing birthdate.');
