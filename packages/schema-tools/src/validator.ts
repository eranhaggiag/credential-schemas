/**
 * JSON Schema (Draft 2020-12) validation built on ajv.
 *
 * Used by `scripts/validate.ts` in CI and by the examples package. Each credential type's
 * `schema.json` describes its claim set; both the JSON-LD and SD-JWT VC examples must
 * validate against it.
 */
import Ajv2020 from 'ajv/dist/2020.js';
import type { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

export interface ValidationResult {
  valid: boolean;
  errors: ErrorObject[];
}

/** Build an ajv instance configured for Draft 2020-12 with standard formats. */
export function createAjv(): Ajv2020 {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
  });
  addFormats(ajv);
  // E.164 phone numbers: bare digits with leading + (no spaces/dashes).
  ajv.addFormat('e164', /^\+[1-9]\d{6,14}$/);
  // IATA airport code (3 uppercase letters).
  ajv.addFormat('iata-airport', /^[A-Z]{3}$/);
  return ajv;
}

/** Compile a schema once and return a reusable validate function. */
export function compile(schema: object, ajv: Ajv2020 = createAjv()): ValidateFunction {
  return ajv.compile(schema);
}

/** Validate `data` against `schema`, returning a normalized result. */
export function validate(schema: object, data: unknown, ajv?: Ajv2020): ValidationResult {
  const fn = compile(schema, ajv);
  const valid = fn(data) as boolean;
  return { valid, errors: fn.errors ?? [] };
}

/** Human-readable one-line-per-error formatting for CI logs. */
export function formatErrors(errors: ErrorObject[]): string {
  return errors
    .map((e) => `  ${e.instancePath || '<root>'} ${e.message ?? ''}`.trimEnd())
    .join('\n');
}
