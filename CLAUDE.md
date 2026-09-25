# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SICAP.ai is a search engine for Romanian public procurement data (from e-licitatie.ro). It's a TypeScript monorepo using pnpm workspaces and Turborepo.

## Commands

```bash
# Development
pnpm dev              # Start dev server (port 3042)
pnpm db:dev           # Start local Turso DB server

# Build & Production
pnpm build            # Build all packages
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm fmt              # Format code with Biome
pnpm typecheck        # TypeScript type checking

# Tests (Vitest, per package — no root-level test task)
pnpm --filter @sicap/web test    # apps/web unit tests
pnpm --filter @sicap/api test    # packages/api unit tests

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Open Drizzle Studio GUI

# UI Components
pnpm ui:add <name>    # Add Shadcn component (e.g., pnpm ui:add button)

# Other
pnpm sitemap          # Generate sitemap
pnpm mastra:dev       # Run Mastra AI agent dev server
pnpm clean            # Clean all build artifacts and node_modules
```

## Architecture

### Monorepo Structure

- `apps/web/` - Next.js 16 application (main app)
- `packages/api/` - Elasticsearch queries and API logic
- `packages/ui/` - Shared Shadcn UI components
- `packages/data/` - Data models and utilities
- `internal/tailwind-config/` - Shared Tailwind configuration
- `internal/tsconfig/` - Shared TypeScript configurations

### Key Technologies

- **Framework**: Next.js 16 with React 19, App Router, React Server Components
- **Database**: Turso (distributed SQLite) with Drizzle ORM
- **Search**: Elasticsearch 8.x
- **Auth**: Better Auth with Google OAuth (database sessions); also the OAuth provider for the MCP server
- **AI**: Mastra framework with OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS + Shadcn UI (Radix primitives)
- **Linting**: Biome (100 char line width)

### Elasticsearch Indices

The app queries four indices via `packages/api/src/es/`:
- `sicap-public` - Public tenders (licitatii)
- `sicap-direct` - Direct acquisitions (achizitii directe)
- `sicap-offline` - Offline acquisitions
- `sicap-search` - Search index

### Main Routes

- `/licitatii/*` - Public tenders
- `/achizitii/*` - Direct acquisitions
- `/achizitii-offline/*` - Offline acquisitions
- `/cauta` - Search results
- `/firma/[nationalId]` - Company detail
- `/autoritate/[nationalId]` - Authority detail
- `/(embed)/embed` - Embeddable widget
- `/api/mcp` - OAuth-authenticated MCP server for AI agents (see `docs/architecture.md`)
- `/mcp` - Public MCP connector setup page
- `/oauth/consent` - OAuth consent screen for MCP authorization

### Database Schema

Located in `apps/web/src/db/schema.ts`. Better Auth tables: `user`, `session`, `account`, `verification`. MCP OAuth-provider tables: `oauthApplication`, `oauthAccessToken`, `oauthConsent`. MCP rate limiting: `mcp_rate_limit`.

### API Package Pattern

Elasticsearch queries in `packages/api/src/`:
- `search-contracts.ts` - Multi-field search with filters
- `get-contract.ts` - Contract details (public/direct/offline variants)
- `get-company.ts` - Company aggregations
- `get-authority.ts` - Authority queries
- `get-total.ts` - Index totals

### harta-firmelor.ro links

Firm pages, the footer and `/despre` carry plain anchors to harta-firmelor.ro (the owner's sister site). The anchor is `components/harta-firmelor-link.tsx`, gated by `isEmbeddableCui`, never `nofollow`. Rules and the isolation test: `docs/architecture.md`.

### MCP Server

Authenticated users query the procurement data from Claude and other agents via an OAuth-authenticated MCP server at `/api/mcp` (Better Auth `mcp` plugin + `mcp-handler`, stateless Streamable HTTP). Six read-only tools (`search_contracts`, `get_contract`, `get_company`, `get_authority`, `get_locality_stats`, `get_totals`) wrap `packages/api`, with per-user rate limiting and Axiom telemetry. Deep dive: `docs/architecture.md`.

### Environment Variables

Required in `.env`:
- `ES_URL`, `ES_API_KEY` - Elasticsearch connection
- `DATABASE_URL`, `DATABASE_AUTH_TOKEN` - Turso database
- `NEXTAUTH_URL`, `AUTH_SECRET` - Auth configuration (Better Auth)
- `OG_SECRET` - OG image generation
- `BASE_URL` - Public base URL (used for the MCP connector URL and result links)

## Code Conventions

- Language: Romanian for UI text, English for code/comments
- Main branch: `v2`
- Use `"use client"` directive only for interactive components
- Server Components are the default in Next.js 16
- Biome handles linting and formatting
- **After making code changes, always run:**
  ```bash
  pnpm lint      # Check for lint errors and warnings
  pnpm fmt       # Format code according to Biome rules
  pnpm typecheck # Verify TypeScript types
  ```

**After meaningful feature changes, update `README.md` (user-facing), `CLAUDE.md` (this file), and `docs/architecture.md` (deep dives).** "Meaningful" = a new CLI command or flag, a new behavior or default, a new module / page / route, a schema change, a new external dependency, or anything a future user/agent would otherwise have to read the diff to discover. Trivial bug fixes and pure refactors don't need a doc update. For changes under `web/`, also touch `web/README.md` if the user-facing dev/build/run story changed. **Keep CLAUDE.md scannable** — push detailed mechanics into `docs/architecture.md` and link from here.

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:
- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:
- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED
WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:
- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)
Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)
If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)
Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `ctx_stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |

## Design Context

Design, UI, and frontend work in this repo is guided by [`PRODUCT.md`](./PRODUCT.md) (strategic) and [`DESIGN.md`](./DESIGN.md) (visual system). Read them before any design task.

- **Register:** `product` (design serves the tool, not marketing).
- **Core job:** find the right procurement record fast. Search is the hero.
- **Primary users:** businesses & bidders, then journalists/watchdogs and researchers/analysts.
- **Personality:** fast, trustworthy, clear. Feel references: Linear, Perplexity.
- **Avoid:** government-portal bloat (e-licitatie.ro), hypey SaaS marketing, consumer-playful, generic AI-dashboard sameness.
- **A11y bar:** WCAG 2.1 AA.

The `/impeccable` skill reads these files automatically. Regenerate the visual spec with `/impeccable document`.
