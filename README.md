

# SICAP.ai

## Sistem Inteligent de Căutare Achiziții Publice

Aplicație web care permite căutarea și vizualizarea achizițiilor publice din România, folosind date din Sistemul Electronic de Achiziții Publice (e-licitatie.ro).

## Tech Stack

### Frontend & Framework

- **[Next.js 16](https://nextjs.org/)** - Framework React pentru aplicații web
- **[React 19](https://react.dev/)** - Bibliotecă pentru interfețe utilizator
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript cu tipare statice
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Shadcn UI](https://ui.shadcn.com/)** - Componente UI reutilizabile

### Backend & Date

- **[Elasticsearch](https://www.elastic.co/elasticsearch)** - Motor de căutare și analiză
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM TypeScript pentru baze de date
- **[Turso](https://turso.tech/)** - Bază de date SQLite distribuită (LibSQL)

### AI & Agenți

- **[Mastra](https://mastra.ai/)** - Framework pentru agenți AI
- **[OpenAI](https://openai.com/)** - Model de limbaj pentru asistent AI
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - SDK pentru integrări AI

### Autentificare & Servicii

- **[Better Auth](https://www.better-auth.com/)** - Autentificare pentru Next.js (+ provider OAuth pentru conectorul MCP)
- **[PostHog](https://posthog.com/)** - Analiză produs
- **[Formbricks](https://formbricks.com/)** - Sondaje și feedback
- **[Listmonk](https://listmonk.app/)** - Email marketing self-hosted

### Infrastructură

- **[Turborepo](https://turbo.build/)** - Build system pentru monorepo
- **[pnpm](https://pnpm.io/)** - Package manager rapid
- **[Biome](https://biomejs.dev/)** - Linting și formatare
- **[Docker](https://www.docker.com/)** - Containerizare

## Structura Proiectului

```
sicap.ai/
├── apps/
│   └── web/              # Aplicația Next.js principală
├── packages/
│   ├── api/              # Logică API și interacțiuni Elasticsearch
│   ├── data/             # Modele de date și utilități
│   └── ui/               # Componente UI partajate
└── internal/
    ├── tailwind-config/  # Configurație Tailwind partajată
    └── tsconfig/         # Configurații TypeScript partajate
```

## Conector MCP (Claude / agenți AI)

Utilizatorii autentificați pot interoga datele de achiziții publice direct din Claude sau din alți agenți compatibili [Model Context Protocol](https://modelcontextprotocol.io/), autentificându-se cu contul SICAP.ai (Google) — fără token-uri de copiat. Vezi pagina `/mcp` pentru URL-ul conectorului și pașii de configurare. Detalii tehnice: [`docs/architecture.md`](docs/architecture.md#mcp-server).

## Cerințe

- **Node.js** >= 20
- **pnpm** >= 10.13.1
- **Elasticsearch** >= 8.x (pentru date)
- **Turso** sau SQLite local (pentru baza de date)

## Configurare

### 1. Clonare repository

```bash
git clone https://github.com/ciocan/sicap.ai.git
cd sicap.ai
```

### 2. Instalare dependențe

```bash
pnpm install
```

### 3. Configurare variabile de mediu

Creează un fișier `.env` în rădăcina proiectului cu următoarele variabile:

```bash
# ==========================================
# ELASTICSEARCH - Obligatoriu
# ==========================================
ES_URL="http://localhost:9200"
ES_API_KEY="your-elasticsearch-api-key"

# Indecși Elasticsearch
ES_INDEX_PUBLIC="sicap-public"
ES_INDEX_DIRECT="sicap-direct"
ES_INDEX_OFFLINE="sicap-offline"
ES_INDEX_SEARCH="sicap-search"

# ==========================================
# BAZĂ DE DATE (Turso/LibSQL) - Obligatoriu
# ==========================================
DATABASE_URL="libsql://your-database.turso.io"
DATABASE_AUTH_TOKEN="your-turso-auth-token"

# Pentru dezvoltare locală cu Turso Dev:
# DATABASE_URL="http://127.0.0.1:8080"
# DATABASE_AUTH_TOKEN="abcd"

# ==========================================
# APLICAȚIE - Obligatoriu
# ==========================================
BASE_URL="http://localhost:3042"
NEXTAUTH_URL="http://localhost:3042"
AUTH_SECRET="your-auth-secret-min-32-chars"
OG_SECRET="your-og-image-secret"

# ==========================================
# AUTENTIFICARE GOOGLE - Opțional
# ==========================================
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"

# ==========================================
# OPENAI - Pentru asistent AI
# ==========================================
OPENAI_API_KEY="sk-your-openai-api-key"

# ==========================================
# LISTMONK - Email (Opțional)
# ==========================================
LISTMONK_API_URL="https://your-listmonk-instance.com"
LISTMONK_API_KEY="your-listmonk-api-key"
LISTMONK_FROM_EMAIL="noreply@sicap.ai"

# ==========================================
# ANALYTICS - Opțional
# ==========================================
# PostHog
NEXT_PUBLIC_POSTHOG_API_KEY="phc_your-posthog-key"
NEXT_PUBLIC_POSTHOG_API_HOST="https://eu.posthog.com"
NEXT_PUBLIC_POSTHOG_UI_HOST="https://eu.posthog.com"

# Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="sicap.ai"
NEXT_PUBLIC_PLAUSIBLE_URL="https://plausible.io"

# ==========================================
# FEEDBACK - Opțional
# ==========================================
NEXT_PUBLIC_FORMBRICKS_API_HOST="https://app.formbricks.com"
NEXT_PUBLIC_FORMBRICKS_ENV_ID="your-formbricks-env-id"

# ==========================================
# MONITORIZARE - Opțional
# ==========================================
NEXT_PUBLIC_OPENSTATUS_RUM_DSN="your-openstatus-dsn"

# ==========================================
# ALTELE - Opțional
# ==========================================
API_SERVICES_TOKEN="your-internal-api-token"
NEXT_PUBLIC_CLOUDFLARE_HOST="your-cloudflare-host"
NEXT_PUBLIC_CLOUDFLARE_TOKEN="your-cloudflare-token"
NEXT_PUBLIC_TELEMETRY_DISABLED="true"
```

## Comenzi de dezvoltare

### Pornire server de dezvoltare

```bash
pnpm dev
```

Aplicația va rula pe [http://localhost:3042](http://localhost:3042)

### Bază de date locală (Turso Dev)

```bash
# Pornește serverul Turso local
pnpm db:dev

# Generează migrări
pnpm db:generate

# Aplică migrări
pnpm db:migrate

# Interfață vizuală pentru DB
pnpm db:studio

# Curăță fișierele DB locale
pnpm db:dev:clean
```

### Curățare cache și dependențe

```bash
pnpm clean
```

### Build pentru producție

```bash
pnpm build
```

### Pornire în producție

```bash
pnpm start
```

### Linting și formatare

```bash
# Verifică codul
pnpm lint

# Formatează codul
pnpm fmt

# Verifică tipurile TypeScript
pnpm typecheck
```

### Generare sitemap

```bash
pnpm sitemap
```

### Agent Mastra (AI)

```bash
pnpm mastra:dev
```

## Docker

### Build și rulare cu Docker Compose

```bash
# Build imagine
docker compose build

# Pornire container
docker compose up -d
```

### Build manual

```bash
docker build -t sicap-ai .
docker run -p 3000:3000 --env-file .env sicap-ai
```

## Adăugare componente UI

Pentru a adăuga noi componente din registrul Shadcn:

```bash
pnpm ui:add button
pnpm ui:add card
# etc.
```

## Licență

[MIT](LICENSE)

## Autor

[Radu Ciocan](https://github.com/ciocan)
