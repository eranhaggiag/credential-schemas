/**
 * Minimal SD-JWT (RFC 9901) disclosure helpers used by the examples package.
 *
 * This is a teaching implementation of the selective-disclosure mechanics — it computes
 * disclosure strings and their digests so a holder can present a subset of claims. It is
 * not a full issuer/verifier and deliberately avoids key management.
 *
 * Spec: RFC 9901 (Selective Disclosure for JWTs), used by
 * draft-ietf-oauth-sd-jwt-vc-16.
 */
import { createHash, randomBytes } from 'node:crypto';

export const SD_ALG = 'sha-256';

/** base64url without padding, per RFC 9901. */
export function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64url');
}

/** A 128-bit salt, base64url-encoded. */
export function makeSalt(): string {
  return base64url(randomBytes(16));
}

/**
 * Build an object-property Disclosure: base64url(JSON([salt, claimName, value])).
 * Returns the disclosure string and its `_sd` digest.
 */
export function makeObjectDisclosure(
  claimName: string,
  value: unknown,
  salt: string = makeSalt(),
): { disclosure: string; digest: string } {
  const json = JSON.stringify([salt, claimName, value]);
  const disclosure = base64url(json);
  return { disclosure, digest: digest(disclosure) };
}

/** The `_sd` digest of a disclosure string: base64url(sha-256(ascii(disclosure))). */
export function digest(disclosure: string): string {
  return base64url(createHash('sha256').update(disclosure, 'ascii').digest());
}

/**
 * Parse a disclosure string back into [salt, claimName, value].
 * Useful for verifier-side checks in the examples.
 */
export function parseDisclosure(disclosure: string): [string, string, unknown] {
  return JSON.parse(Buffer.from(disclosure, 'base64url').toString('utf8')) as [
    string,
    string,
    unknown,
  ];
}
