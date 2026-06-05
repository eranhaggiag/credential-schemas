# Email Verification

A credential attesting proof of control over an email address.

- **JSON-LD type:** `EmailVerificationCredential`
- **SD-JWT VC `vct`:** `https://schemas.fido.example/vct/email-verification`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim                 | Type                 | Required | Selectively disclosable | Notes                                        |
| --------------------- | -------------------- | -------- | ----------------------- | -------------------------------------------- |
| `email`               | `string` (email)     | Yes      | **Yes — `always`**      | Identifying; forced selectively disclosable. |
| `verification_method` | `enum`               | Yes      | Yes (`allowed`)         | `link_click` \| `otp` \| `dkim_proof`.       |
| `verified_at`         | `string` (date-time) | Yes      | Yes (`allowed`)         | When control was proven.                     |

## Disclosability notes

- `email` is `sd: always`; the address is the identifying datum.
