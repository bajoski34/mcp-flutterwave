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
- **Webhooks** — the original embedded docs include a `webhooks:` block and matching payload schemas. Those payload schemas arrived with broken YAML indentation (duplicate keys under `properties:`), so the webhook section and its schemas were dropped from the vendored copies. Operation schemas used for tool generation are intact. Re-add webhooks when we have a clean re-extract.

## Code generation

v4 uses **[Orval](https://orval.dev/)** (not `openapi-typescript` / not `openapi-generator`) to emit Zod validators from these fragments.

```bash
npm run generate:v4
```

Also runs as part of `npm run build` (after v3 `build:types`). Commit the regenerated files under `src/client/generated/v4/` with any YAML changes.

Config: [`orval.config.ts`](../../../orval.config.ts) at the repo root.  
Output: [`src/client/generated/v4/*.zod.ts`](../../generated/v4/).

Do not edit the generated files by hand — change the YAML (or the Orval config) and re-run the command above.
