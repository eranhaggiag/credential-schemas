# PLAN — FIDO Alliance Credential Schema Registry

A dual-format verifiable credential schema registry (W3C VC 2.0 JSON-LD **and** IETF SD-JWT VC)
plus an all-in-one documentation / browser / demo website.

## Spec versions targeted (verified June 2026)

| Spec                                  | Version                                        | Notes                                                            |
| ------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| W3C Verifiable Credentials Data Model | **2.0** — W3C Recommendation, 15 May 2025      | Base context `https://www.w3.org/ns/credentials/v2`              |
| SD-JWT VC                             | **draft-ietf-oauth-sd-jwt-vc-16**, 24 Apr 2026 | EUDI ARF interop target; primary format                          |
| SD-JWT                                | **RFC 9901**, Nov 2025                         | Salted-hash selective disclosure (`_sd`, `_sd_alg`, disclosures) |
| JSON Schema                           | **Draft 2020-12**                              | Shared claim schemas                                             |

## Configurable bases

- `contextBase` = `https://schemas.fido.example/contexts/`
- `vctBase` = `https://schemas.fido.example/vct/`

Both env-overridable (`FIDO_CONTEXT_BASE`, `FIDO_VCT_BASE`) in `scripts/build-registry.ts`.

## The eight credential types

1. `employee-id` — Employee ID
2. `proof-of-employment` — Proof of Employment / Alumni ID
3. `bank-id` — Bank ID
4. `phone-verification` — Phone Number Verification
5. `email-verification` — Email Verification
6. `age-verification` — Age Verification (predicates + disclosable birthdate)
7. `education-certificate` — Education Certificate
8. `boarding-pass` — Boarding Pass

## Tech choices

- **Astro** (static + islands) for the site — content-driven, zero-JS by default, trivial GitHub
  Pages static deploy, islands only where the format toggle / copy buttons need interactivity.
- **ajv** + `ajv-formats` for JSON Schema 2020-12 validation.
- **pnpm** workspace, TypeScript strict everywhere.

## Milestones (commit at each)

1. Scaffold workspace + docs + LICENSE. ✅
2. `schema-tools` package (registry loader, ajv validators, base resolution).
3. Age Verification type end-to-end (all 6 files) + `validate.ts` + `build-registry.ts`, passing.
4. Remaining seven types; run validator; fix failures.
5. `packages/examples` issuance/verification/selective-disclosure snippets.
6. Site wired to `registry.json`; clean static build.
7. CI workflow (lint, typecheck, validate, build site, deploy Pages).

## Layout

```
fido/
├── README.md  LICENSE  CONTRIBUTING.md  package.json  pnpm-workspace.yaml  tsconfig.base.json
├── schemas/<type>/{schema.json, jsonld/{context.jsonld,example.json}, sd-jwt-vc/{vct-metadata.json,example.json}, README.md}
├── schemas/registry.json
├── packages/schema-tools/   packages/examples/
├── site/
├── scripts/{validate.ts, build-registry.ts}
└── .github/workflows/ci.yml
```
