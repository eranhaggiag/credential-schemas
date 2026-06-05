# Age Verification

Proves a holder's age. The design goal is **data minimization**: a holder should be able to
present a single boolean predicate (e.g. `age_over_18`) to a verifier without ever revealing
their birthdate.

- **JSON-LD type:** `AgeVerificationCredential`
- **SD-JWT VC `vct`:** `https://schemas.glideidentity.app/vct/age-verification`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 (24 Apr 2026) · RFC 9901

## Claims

| Claim         | Type                 | Required | Selectively disclosable | Notes                                                                                             |
| ------------- | -------------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `birthdate`   | `string` (full-date) | No       | **Yes — `sd: always`**  | Privacy-sensitive. **Must never be mandatory-disclosed** when a predicate satisfies the verifier. |
| `age_over_13` | `boolean`            | No       | Yes (`sd: allowed`)     | Predicate. Present at least one predicate or `birthdate`.                                         |
| `age_over_18` | `boolean`            | No       | Yes (`sd: allowed`)     | Predicate.                                                                                        |
| `age_over_21` | `boolean`            | No       | Yes (`sd: allowed`)     | Predicate.                                                                                        |

Schema rule: at least one of `age_over_13` / `age_over_18` / `age_over_21` / `birthdate` must
be present (`anyOf`). No single claim is mandatory — the holder/verifier choose the minimal set.

## Disclosability notes

- `birthdate` is marked `sd: always` in the SD-JWT VC type metadata, forcing the issuer to make
  it a Disclosure rather than baking it into the always-visible payload. The holder therefore
  controls whether it is ever shown.
- The predicates are each independent Disclosures, so the holder reveals only the one a verifier
  needs (the example presentation discloses just `age_over_18`).
- **Do not** require `birthdate` in a presentation request when a predicate suffices.

## Files

- `schema.json` — shared claim schema (Draft 2020-12).
- `jsonld/context.jsonld` + `jsonld/example.json` — W3C VC 2.0 representation.
- `sd-jwt-vc/vct-metadata.json` + `sd-jwt-vc/example.json` — SD-JWT VC representation (decoded
  payload + disclosures; run `pnpm seal` to compute digests).
