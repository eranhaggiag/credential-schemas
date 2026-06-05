# FIDO Schemas — Verifiable Credential Schema Registry

A **dual-format verifiable credential schema registry**: every credential type is published as
both a **W3C Verifiable Credentials 2.0** JSON-LD credential and an **IETF SD-JWT VC**, from a
single shared JSON Schema claim set. Privacy-sensitive claims are individually disclosable, and
age checks use **predicates** (`age_over_18`) rather than forcing birthdate disclosure.

Comes with an all-in-one website that documents, browses, and demonstrates the schemas.

## Spec versions targeted

| Spec                                                                                  | Version                                            | Role                                                                        |
| ------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| [W3C Verifiable Credentials Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/) | **2.0** — W3C Recommendation, **15 May 2025**      | JSON-LD representation; base context `https://www.w3.org/ns/credentials/v2` |
| [SD-JWT VC](https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/)             | **draft-ietf-oauth-sd-jwt-vc-16**, **24 Apr 2026** | Primary format; EUDI Wallet ARF / OID4VCI interop target                    |
| [SD-JWT](https://www.rfc-editor.org/rfc/rfc9901.html)                                 | **RFC 9901**, Nov 2025                             | Selective-disclosure mechanics (`_sd`, `_sd_alg`, Disclosures)              |
| JSON Schema                                                                           | **Draft 2020-12**                                  | Shared claim schemas                                                        |

Each `vct-metadata.json` and `context.jsonld` carries a `$comment` naming the exact spec version
it targets.

## The eight credential types

| Type                            | id                      | What it proves                                                    |
| ------------------------------- | ----------------------- | ----------------------------------------------------------------- |
| Employee ID                     | `employee-id`           | Employer, employee ID, role, department, status                   |
| Proof of Employment / Alumni ID | `proof-of-employment`   | "Employed at" (current/former), no salary                         |
| Bank ID                         | `bank-id`               | Issuer, holder, KYC level, jurisdiction, national-ID linkage flag |
| Phone Number Verification       | `phone-verification`    | Cryptographic control of an E.164 number                          |
| Email Verification              | `email-verification`    | Control of an email address                                       |
| Age Verification                | `age-verification`      | `age_over_13/18/21` predicates + disclosable birthdate            |
| Education Certificate           | `education-certificate` | Institution, degree, field, award date, grade                     |
| Boarding Pass                   | `boarding-pass`         | Passenger, carrier, flight, route, seat, PNR                      |

## Layout

```
schemas/<type>/
  schema.json            shared JSON Schema (Draft 2020-12) — the claim set
  jsonld/context.jsonld  W3C VC 2.0 JSON-LD context
  jsonld/example.json    example W3C VC 2.0 credential
  sd-jwt-vc/vct-metadata.json   SD-JWT VC Type Metadata
  sd-jwt-vc/example.json        decoded SD-JWT VC payload + disclosures (sealed)
  README.md              claim table + disclosability notes
schemas/registry.json    machine-readable index (generated)
packages/schema-tools/   load/resolve/validate; ajv + SD-JWT helpers
packages/examples/       runnable issue / verify / selective-disclosure snippets
site/                    Astro website
scripts/                 build-registry, seal-examples, validate
```

## Configurable bases

`vct` and `@context` URLs derive from two env-overridable bases so a fork can repoint everything:

| Env var             | Default                                  |
| ------------------- | ---------------------------------------- |
| `FIDO_VCT_BASE`     | `https://schemas.fido.example/vct/`      |
| `FIDO_CONTEXT_BASE` | `https://schemas.fido.example/contexts/` |

## Usage

```bash
pnpm install
pnpm build:registry   # regenerate schemas/registry.json from the tree
pnpm seal             # compute SD-JWT VC disclosure digests in examples (idempotent)
pnpm validate         # every example must validate against its schema.json
pnpm --filter @fido/examples all   # issue → present age_over_18 → verify
pnpm dev:site         # run the website locally
SITE_BASE=/pocs/ pnpm build:site    # static build for GitHub Pages
```

## Website

Built with **Astro** (static + islands) and Tailwind. Astro was chosen over Next.js because the
site is content-driven (it renders from `registry.json` at build time), ships zero JS by default
with small islands only for the copy buttons and format toggle, and deploys to GitHub Pages as
plain static files with no server. Three sections: **Landing**, **Schema registry/browser**
(auto-generated from `registry.json`), and **Developer docs** (snippets pulled from
`packages/examples`). The registry browser hardcodes no schema list.

> The logo at `site/public/logo.svg` is a placeholder — drop in the official FIDO Alliance asset.

## Validation guarantee

`scripts/validate.ts` (run in CI) extracts the claim set from **both** representations of every
type and validates it against that type's `schema.json`. A change that breaks either format fails
the build.

## License

Apache-2.0. Examples use obviously-fake data — no real personal information.
