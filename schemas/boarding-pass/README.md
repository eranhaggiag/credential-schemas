# Boarding Pass

A verifiable flight boarding pass.

- **JSON-LD type:** `BoardingPassCredential`
- **SD-JWT VC `vct`:** `https://schemas.glideidentity.app/vct/boarding-pass`
- **Spec targets:** W3C VCDM 2.0 (15 May 2025) · SD-JWT VC draft-16 · RFC 9901

## Claims

| Claim            | Type                    | Required | Selectively disclosable | Notes                                              |
| ---------------- | ----------------------- | -------- | ----------------------- | -------------------------------------------------- |
| `passenger_name` | `string`                | Yes      | **Yes — `always`**      | Identifying; forced selectively disclosable.       |
| `carrier`        | `string` (IATA, 2 char) | Yes      | Yes (`allowed`)         | e.g. `GA`.                                         |
| `flight_number`  | `string`                | Yes      | Yes (`allowed`)         | e.g. `GA417`.                                      |
| `origin`         | `string` (IATA airport) | Yes      | Yes (`allowed`)         | e.g. `ARN`.                                        |
| `destination`    | `string` (IATA airport) | Yes      | Yes (`allowed`)         | e.g. `LHR`.                                        |
| `departure_time` | `string` (date-time)    | Yes      | Yes (`allowed`)         | Local time with offset.                            |
| `seat`           | `string`                | No       | Yes (`allowed`)         | e.g. `14C`.                                        |
| `boarding_group` | `string`                | No       | Yes (`allowed`)         | e.g. `B`.                                          |
| `pnr`            | `string`                | No       | **Yes — `always`**      | Booking reference; forced selectively disclosable. |

## Disclosability notes

- `passenger_name` and `pnr` are `sd: always` — the PNR is a sensitive booking key (it can be used
  to access or modify a reservation), so it is never baked into the always-visible payload.
- At a boarding gate the holder can disclose the flight, route, seat, and group while keeping
  their name and PNR hidden.
