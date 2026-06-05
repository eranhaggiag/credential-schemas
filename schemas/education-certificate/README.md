# Education Certificate

A verifiable academic credential.

- **JSON-LD type:** `EducationCertificateCredential`
- **SD-JWT VC `vct`:** `https://schemas.fido.example/vct/education-certificate`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim                | Type            | Required | Selectively disclosable | Notes                                                                |
| -------------------- | --------------- | -------- | ----------------------- | -------------------------------------------------------------------- |
| `institution`        | `string`        | Yes      | Yes (`allowed`)         | Awarding institution.                                                |
| `credential_name`    | `string`        | Yes      | Yes (`allowed`)         | Degree / credential name.                                            |
| `field_of_study`     | `string`        | No       | Yes (`allowed`)         |                                                                      |
| `award_date`         | `string` (date) | Yes      | Yes (`allowed`)         |                                                                      |
| `grade`              | `string`        | No       | **Yes — `always`**      | Optional; forced selectively disclosable so it is never over-shared. |
| `accreditation_body` | `string`        | No       | Yes (`allowed`)         |                                                                      |

## Disclosability notes

- `grade` is `sd: always`: a holder can prove they hold the degree without revealing their
  classification. Verifiers should request it only when genuinely needed.
