# Proof of Employment / Alumni ID

A verifiable "employed at" claim — current staff or alumni — that deliberately carries **no
salary or compensation data**.

- **JSON-LD type:** `ProofOfEmploymentCredential`
- **SD-JWT VC `vct`:** `https://schemas.glideidentity.app/vct/proof-of-employment`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim              | Type            | Required    | Selectively disclosable | Notes                               |
| ------------------ | --------------- | ----------- | ----------------------- | ----------------------------------- |
| `employer`         | `string`        | Yes         | Yes (`allowed`)         | Legal name of employer.             |
| `status`           | `enum`          | Yes         | Yes (`allowed`)         | `current` \| `former`.              |
| `employment_start` | `string` (date) | Yes         | Yes (`allowed`)         |                                     |
| `employment_end`   | `string` (date) | Conditional | Yes (`allowed`)         | Required when `status` is `former`. |

## Disclosability notes

- There is **no salary field by design** — this credential proves the relationship only.
- A holder can disclose just `employer` + `status` to prove "current/former employee" while
  keeping the employment dates private.
