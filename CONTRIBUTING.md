# Contributing

Thanks for helping improve the FIDO Alliance credential schema registry.

## Ground rules

- **Two formats, one source of truth.** Every credential type ships both a W3C VC 2.0
  JSON-LD representation and an IETF SD-JWT VC representation. The claim set is defined
  once in `schema.json` (JSON Schema Draft 2020-12) and both examples MUST validate
  against it.
- **No real personal data.** Examples use obviously-fake values (e.g. `Jordan Avery`,
  `EU-12345`). Never commit a real name, email, phone, or government ID.
- **Internal consistency.** Dates, IATA codes, and E.164 phone numbers in examples must
  be individually valid and mutually consistent (e.g. `exp` after `iat`).
- **Cite the spec.** Each `vct-metadata.json` and `context.jsonld` carries a `$comment`
  naming the exact spec version it targets.

## Adding or changing a credential type

1. Create `schemas/<type>/` with the six required files (see an existing type, e.g.
   `schemas/age-verification/`, as a template):
   - `schema.json` — the shared claim schema.
   - `jsonld/context.jsonld` + `jsonld/example.json`
   - `sd-jwt-vc/vct-metadata.json` + `sd-jwt-vc/example.json`
   - `README.md` with the claim table.
2. Do **not** hand-edit `schemas/registry.json`. Run `pnpm build:registry` to regenerate it.
3. Run `pnpm validate` — every example must validate against its `schema.json`.
4. Run `pnpm typecheck` and `pnpm lint`.

## Configurable bases

`vct` and `@context` URLs derive from two bases, overridable via environment variables so a
fork can repoint them:

- `FIDO_CONTEXT_BASE` (default `https://schemas.fido.example/contexts/`)
- `FIDO_VCT_BASE` (default `https://schemas.fido.example/vct/`)

Never hardcode these URLs in UI or schema-tools — resolve them from `registry.json`.

## Commit messages

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`). Commit at logical milestones.

## Disclosability discipline

When adding a privacy-sensitive claim, mark its `sd` value in the SD-JWT VC type metadata
(`always` / `allowed` / `never`) and reflect it in the README claim table. Birthdate-style
claims that have a predicate alternative (e.g. `age_over_18`) must **never** be
mandatory-disclosed.
