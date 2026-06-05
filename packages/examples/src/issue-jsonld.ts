/**
 * Issue a W3C Verifiable Credential 2.0 (JSON-LD) credential object.
 *
 * Spec: W3C VCDM 2.0 (15 May 2025). Securing the credential (e.g. via Data Integrity proofs
 * or an enveloping JOSE/COSE signature) is a separate step not shown here.
 */
// #region issue-jsonld
export interface JsonLdInput {
  contextUrl: string;
  type: string; // e.g. "AgeVerificationCredential"
  issuer: string;
  validFrom: string;
  validUntil?: string;
  subjectId: string;
  claims: Record<string, unknown>;
}

export function issueJsonLd(input: JsonLdInput): Record<string, unknown> {
  return {
    '@context': ['https://www.w3.org/ns/credentials/v2', input.contextUrl],
    type: ['VerifiableCredential', input.type],
    issuer: input.issuer,
    validFrom: input.validFrom,
    ...(input.validUntil ? { validUntil: input.validUntil } : {}),
    credentialSubject: { id: input.subjectId, ...input.claims },
  };
}
// #endregion issue-jsonld

if (import.meta.url === `file://${process.argv[1]}`) {
  const vc = issueJsonLd({
    contextUrl: 'https://schemas.glideidentity.app/contexts/age-verification.jsonld',
    type: 'AgeVerificationCredential',
    issuer: 'https://issuer.glideidentity.app',
    validFrom: '2026-01-15T09:00:00Z',
    validUntil: '2027-01-15T09:00:00Z',
    subjectId: 'did:example:holder-age-0001',
    claims: { age_over_18: true },
  });
  console.log(JSON.stringify(vc, null, 2));
}
