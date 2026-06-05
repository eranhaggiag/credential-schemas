# Employee ID

Employer-issued workforce identity credential.

- **JSON-LD type:** `EmployeeIdCredential`
- **SD-JWT VC `vct`:** `https://schemas.glideidentity.app/vct/employee-id`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim               | Type     | Required | Selectively disclosable | Notes                                                  |
| ------------------- | -------- | -------- | ----------------------- | ------------------------------------------------------ |
| `employer`          | `string` | Yes      | Yes (`allowed`)         | Legal name of employer.                                |
| `employee_id`       | `string` | Yes      | Yes (`allowed`)         | Employer-assigned identifier.                          |
| `job_title`         | `string` | No       | Yes (`allowed`)         | Role / title.                                          |
| `department`        | `string` | No       | Yes (`allowed`)         |                                                        |
| `employment_status` | `enum`   | Yes      | Yes (`allowed`)         | `active` \| `on_leave` \| `suspended` \| `terminated`. |

Issuance / expiry are carried by the credential envelope — JSON-LD `validFrom`/`validUntil`,
SD-JWT VC `iat`/`exp` — not as subject claims.

## Disclosability notes

All claims are individually disclosable so a holder can, for example, prove "currently employed
at Globex" (`employer` + `employment_status`) without exposing their internal `employee_id` or
`department`.
