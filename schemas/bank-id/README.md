# Bank ID

A bank-issued identity credential carrying a verified KYC assurance level and regulating
jurisdiction. It can attest that a national ID was linked at the bank **without ever carrying the
national ID number itself**.

- **JSON-LD type:** `BankIdCredential`
- **SD-JWT VC `vct`:** `https://schemas.fido.example/vct/bank-id`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim                 | Type                     | Required | Selectively disclosable | Notes                                            |
| --------------------- | ------------------------ | -------- | ----------------------- | ------------------------------------------------ |
| `issuing_institution` | `string`                 | Yes      | Yes (`allowed`)         | Name of the bank.                                |
| `account_holder_name` | `string`                 | Yes      | **Yes — `always`**      | Identifying; forced selectively disclosable.     |
| `kyc_level`           | `enum`                   | Yes      | Yes (`allowed`)         | `basic` \| `standard` \| `enhanced`.             |
| `jurisdiction`        | `string` (ISO 3166-1 α2) | Yes      | Yes (`allowed`)         | e.g. `SE`.                                       |
| `national_id_linked`  | `boolean`                | No       | Yes (`allowed`)         | **Flag only.** The national ID is never present. |

## Disclosability notes

- `account_holder_name` is `sd: always` so the holder controls when their name is revealed.
- `national_id_linked` is a boolean attestation; the underlying national identifier is
  intentionally **out of scope** for this credential and must never be added.
- A holder can prove "enhanced KYC, Swedish jurisdiction" without disclosing their name.
