# v4 OpenAPI spec fragments

These YAML files are **vendored/extracted** from Flutterwave's embedded OpenAPI definitions on the `reference/*.md` documentation pages — not hand-authored like the v3 specs in `../v3/`.

| File | Source page |
|---|---|
| `charge.yaml` | `reference/charges_post.md` |
| `payment-methods.yaml` | `reference/payment_methods_post.md` |

Provenance headers (source URL + fetch date) are preserved at the top of each file.

## What is not here

- **Encryption** — there is no separate encryption spec. The `encrypted_card_in` schema (field-level AES-256-GCM inputs) lives inside `payment-methods.yaml`.
- **Auth** — there is no OpenAPI spec for authentication. v4 auth uses an external Keycloak IDP (`idp.flutterwave.com`) outside the F4B API surface.
