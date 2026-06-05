# Phone Number Verification

A credential attesting **cryptographic proof of control** over an E.164 phone number — not a
one-time live OTP. The holder demonstrated control once; the credential is reusable.

- **JSON-LD type:** `PhoneVerificationCredential`
- **SD-JWT VC `vct`:** `https://schemas.glideidentity.app/vct/phone-verification`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim                 | Type                 | Required | Selectively disclosable | Notes                                                                |
| --------------------- | -------------------- | -------- | ----------------------- | -------------------------------------------------------------------- |
| `phone_number`        | `string` (E.164)     | Yes      | **Yes — `always`**      | Identifying; forced selectively disclosable.                         |
| `verification_method` | `enum`               | Yes      | Yes (`allowed`)         | `sim_binding` \| `carrier_attestation` \| `cryptographic_challenge`. |
| `verified_at`         | `string` (date-time) | Yes      | Yes (`allowed`)         | When control was proven.                                             |
| `carrier_attested`    | `boolean`            | No       | Yes (`allowed`)         | Carrier attested the binding.                                        |

## Disclosability notes

- `phone_number` is `sd: always` — the number is the identifying datum, so the holder controls
  disclosure.
- This is proof of _control_, distinct from sending an OTP at verification time.
