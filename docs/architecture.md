# Architecture deep dives

Detailed mechanics that don't belong in the scannable `CLAUDE.md`. Link here from there.

## MCP Server

Lets authenticated users query the procurement data from Claude (claude.ai, Desktop, Code) and other MCP-capable agents (Cursor, VS Code) via an OAuth-authenticated, remote MCP server hosted inside the Next.js app. The data is public; auth exists for one-click distribution, per-user identity, rate limiting, and usage analytics.

Design spec: `docs/superpowers/specs/2026-05-26-mcp-server-design.md`. Implementation plan: `docs/superpowers/plans/2026-05-26-mcp-server.md`.

### How it fits together

```
Claude / agent
  │  discover  → GET /.well-known/oauth-authorization-server   (oAuthDiscoveryMetadata)
  │            → GET /.well-known/oauth-protected-resource     (oAuthProtectedResourceMetadata)
  │  register  → Dynamic Client Registration (open) → oauthApplication row
  │  authorize → /autentificare (Google) → /oauth/consent → code
  │  token     → access + refresh tokens (oauthAccessToken)
  │  call      → POST /api/mcp  (Authorization: Bearer <token>)
  ▼
withMcpAuth(auth, (req, session) => createMcpHandler(...)(req))   // session = { userId, scopes, accessToken }
  ▼
enforceRateLimit(userId) → tool handler → packages/api fn → Elasticsearch
  ▼
compact JSON  +  Axiom "mcp.tool" event { userId, tool, query, latencyMs, status }
```

### Auth

`apps/web/src/lib/auth.ts` enables the Better Auth `mcp` plugin (`loginPage: "/autentificare"`, `oidcConfig.consentPage: "/oauth/consent"`). This turns the app into an OAuth 2.0 provider with open Dynamic Client Registration. The three OAuth tables (`oauthApplication`, `oauthAccessToken`, `oauthConsent`) are registered in the drizzle adapter `schema` and were generated from `@better-auth/cli generate` (authoritative field names for the installed version).

### Transport & files

Self-hosted via Docker (long-lived Node), so the server uses the stateless **Streamable HTTP** transport — no Redis.

| Path | File | Purpose |
|------|------|---------|
| `POST /api/mcp` (+ `[transport]`) | `apps/web/src/app/api/[transport]/route.ts` | `withMcpAuth` + `createMcpHandler` (`mcp-handler`), `basePath: "/api"`; exports `GET/POST/DELETE` |
| `/.well-known/oauth-authorization-server` | `apps/web/src/app/.well-known/.../route.ts` | `oAuthDiscoveryMetadata(auth)` |
| `/.well-known/oauth-protected-resource` | `apps/web/src/app/.well-known/.../route.ts` | `oAuthProtectedResourceMetadata(auth)` |
| `/oauth/consent` | `apps/web/src/app/(main)/oauth/consent/` | Styled consent screen; posts `{ accept }` to `/api/auth/oauth2/consent` |
| `/mcp` | `apps/web/src/app/(main)/mcp/page.tsx` | Public connector docs + setup snippets |
| helpers | `apps/web/src/lib/mcp/` | `format.ts` (compact projection), `index-map.ts` (ES index ↔ slug), `contracts.ts` (dispatch), `rate-limit.ts` |

### Tools (read-only)

All wrap `packages/api`. Results are compact JSON; `search_contracts` returns ≤50 rows (default 10) projected to `{ id, type, object, authority, supplier, value, date, cpv, url }` + `totalCount`; detail tools return the full document.

| Tool | Backing fn(s) |
|------|---------------|
| `search_contracts` | `searchContracts` |
| `get_contract` | `getContractLicitatii` / `getContractAchizitii` / `getContractAchizitiiOffline` (via `getContractBySlug`) |
| `get_company` | `getCompanyByNationalId` + `getCompanyTopAuthorities` |
| `get_authority` | `getAuthorityByNationalId` + `getAuthorityTopSuppliers` |
| `get_locality_stats` | `getLocalityStats` + top authorities/companies/CPV |
| `get_totals` | `getTotal` |

The dataset discriminator is the slug `licitatii | achizitii | achizitii-offline`. `IndexName` from `@sicap/api` is the **raw ES index name**, so the route maps index → slug (`indexToSlug`) for output and slug → index (`slugToIndex`) for the `db` filter, reusing the app's `databases` table in `@/utils`.

### Rate limiting & telemetry

`enforceRateLimit(userId)` (`lib/mcp/rate-limit.ts`) is an atomic fixed-window limiter with two windows per user, 60 calls/min and 500 calls/UTC day, on `mcp_rate_limit` via `INSERT ... ON CONFLICT DO UPDATE ... RETURNING`. The two upserts go out in one `db.batch`; the minute row is keyed `${userId}:${minute}`, the day row `${userId}:d:${day}`. The day limit is checked first so an agent that has burned its daily budget gets the "încearcă din nou mâine" message rather than a "încetinește ritmul" one. Both messages are in Romanian and point to https://api.sicap.ai/ for higher limits. Limits are constants in that file; change them there. Better Auth's own limiter can't see MCP-adapter traffic, so tools enforce this directly. Each call logs an Axiom `mcp.tool` event with `userId`, `tool`, args (incl. query text), `latencyMs`, and `status` (`ok` / `rate_limited` / `error`).

### Gotchas

- **BotID:** `next.config.ts` wraps the app in `withBotId`, but it only blocks where code calls `checkBot()`. The MCP route deliberately does **not** call it — MCP clients are bots and must not be blocked.
- **`mcp-handler`, not `@vercel/mcp-adapter`:** the latter is now a deprecated empty stub; the live package is `mcp-handler` (same `createMcpHandler` API).
- **tsc OOM:** the MCP SDK's generic `server.tool()` overloads trigger TS2589 ("type instantiation excessively deep") and exhaust tsc's heap. The route registers tools through a minimal local `McpToolServer` interface (generic over the handler's `Args`) so the compiler skips that inference; Zod still validates inputs at runtime.
- **Migrations:** `0001_woozy_mauler.sql` (the OAuth + rate-limit tables) must be applied with `pnpm db:migrate` against the target database. It is additive only.

## harta-firmelor.ro links

sicap.ai and [harta-firmelor.ro](https://harta-firmelor.ro) share an owner and the ONRC data. sicap links out to harta on purpose, with plain anchors that carry link equity (issue #82, harta#1176). The rules:

- `apps/web/src/lib/harta-firmelor.ts` owns the origin and the URL builders. `isEmbeddableCui` gates everything: a bare 4 to 10 digit CUI gets a link, anything else (consortium ids, legacy ids) gets nothing, because harta answers 404 for those.
- `components/harta-firmelor-link.tsx` is the one anchor to `https://harta-firmelor.ro/firma/<cui>`, rendered in server HTML. `rel="noopener"` only. Never add `nofollow` or `sponsored`.
- Both firm pages render it. `/firma/[nationalId]` gets it under the framed card (`harta-firmelor-card.tsx`), and `/achizitii/firma/[id]` (`company-achizitii.tsx`, the URL the sitemap advertises and search engines rank) gets it without the frame, plus a link to `/firma/<cui>`. That route's `[id]` is e-licitatie's supplier entityId, not a CUI, so both links come from `supplier.numericFiscalNumber` in the query result.
- The framed card loads harta's `/embed/.../bare` variant, which harta serves `noindex, nofollow`. That is why the anchor lives outside the frame. The card stays on the company page only; `harta-firmelor-isolation.test.ts` greps the import graph and the JSX to keep it off the authority page and pins the anchor rules above.
- The footer links the harta home through `HARTA_FIRMELOR_ORIGIN`, and `/despre` carries one sentence with the same link.
- No link to harta's `/adresa/...` pages yet: that URL ends in harta's `address_key`, which sicap's ONRC index does not carry.
