<p align="center">
  <h1 align="center">⚡ Zipply</h1>
  <p align="center">A modern, full-stack URL shortener with analytics, API access, and team-ready auth — built on Next.js 16.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## ✨ Features

| Category | Details |
|---|---|
| **Link Management** | Create, edit, delete, and search short links with custom codes, auto-generated favicons, and tag-based organization |
| **Analytics Dashboard** | Real-time click tracking with breakdowns by country, browser, OS, device type, and visitors-over-time charts (powered by Tinybird) |
| **REST API** | Versioned API (`/api/v1/links`) with key-based auth, pagination, search, and full CRUD for links |
| **Authentication** | Email/password with verification, Google OAuth, password reset — all via Better Auth |
| **API Key Management** | Generate, list, and revoke API keys from the dashboard for programmatic access |
| **QR Codes** | Instant QR code generation for any shortened link |
| **SEO & Metadata** | Auto-fetches page title and favicon on link creation; sitemap and robots.txt included |
| **Dark Mode** | System-aware theme toggle via `next-themes` |
| **Testing** | Unit tests with Vitest + React Testing Library |
| **CI/CD** | GitHub Actions deployment workflow |

---

## 🧱 Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, Server Actions, `after()`)
- **Language** — TypeScript 5
- **Database** — PostgreSQL with [Prisma 7](https://www.prisma.io) ORM
- **Auth** — [Better Auth](https://www.better-auth.com) (email + Google OAuth)
- **Analytics** — [Tinybird](https://www.tinybird.co) (real-time click events)
- **Styling** — Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Charts** — Recharts
- **State** — Zustand
- **Forms** — React Hook Form + Zod validation
- **Email** — Nodemailer (SMTP)
- **Testing** — Vitest + React Testing Library + jsdom
- **Logging** — Pino

---

## 📁 Project Structure

```
zipply/
├── app/
│   ├── (public)/          # Landing page, auth pages, legal pages
│   ├── [code]/            # Dynamic redirect handler (short link → original URL)
│   ├── api/
│   │   ├── auth/          # Better Auth route handler
│   │   └── v1/links/      # REST API for links (GET, POST, DELETE)
│   ├── dashboard/
│   │   ├── links/         # Link list, create, edit, detail view
│   │   ├── api/           # API key management page
│   │   ├── profile/       # User profile page
│   │   └── settings/      # Application settings
│   └── docs/              # Documentation pages
├── actions/               # Server actions (API keys, user)
├── components/
│   ├── auth/              # Auth forms
│   ├── dashboard/         # Dashboard UI (sidebar, charts, tables, links)
│   ├── sections/          # Landing page sections (hero, features, FAQ, footer)
│   └── ui/                # shadcn/ui primitives
├── data/                  # Data access layer (links, analytics, API keys)
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities (auth, db, mailer, tinybird, logger)
├── prisma/                # Database schema & migrations
├── schemas/               # Zod validation schemas
├── store/                 # Zustand stores
├── test/                  # Test suites
└── types/                 # Shared TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| [Node.js](https://nodejs.org) | ≥ 18 |
| [pnpm](https://pnpm.io) | ≥ 9 |
| [PostgreSQL](https://www.postgresql.org) | ≥ 15 |

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zipply.git
cd zipply
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section below for a full reference.

### 4. Set up the database

```bash
# Generate the Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:root@localhost:5432/zipply` |
| `BETTER_AUTH_SECRET` | Secret key used by Better Auth for signing tokens | Any secure random string |
| `BETTER_AUTH_URL` | Base URL of the auth server | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `NEXT_PUBLIC_BASE_URL` | Public-facing base URL (used for short link generation) | `http://localhost:3000` |
| `TINYBIRD_TOKEN` | Tinybird API auth token | From [Tinybird dashboard](https://app.tinybird.co) |
| `TINYBIRD_URL` | Tinybird API base URL | `https://api.tinybird.co` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `465` |
| `SMTP_USER` | SMTP auth email address | `you@gmail.com` |
| `SMTP_PASS` | SMTP auth password / app password | Gmail app password |

---

## 🔌 API Reference

All API endpoints require authentication via an **API key** passed in the `Authorization` header:

```
Authorization: Bearer zpk_xxxxxxxx
```

API keys can be created from the **Dashboard → API** page.

### Links

#### `GET /api/v1/links`

Retrieve a paginated list of your links.

| Parameter | Type | Description |
|---|---|---|
| `search` | `string` | Filter by URL, short code, or tag |
| `page` | `number` | Page number (default: `1`) |

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "originalUrl": "https://example.com",
      "shortCode": "abc1234",
      "title": "Example",
      "favicon": "https://example.com/icon.png",
      "tags": ["marketing"],
      "clicks": 42,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "totalPages": 3, "total": 25 }
}
```

#### `POST /api/v1/links`

Create a new short link.

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ | Destination URL |
| `shortCode` | `string` | ❌ | Custom short code (auto-generated if omitted) |
| `tags` | `string[]` | ❌ | Organizational tags |

**Response:** `201 Created` with the created link object.

#### `DELETE /api/v1/links`

Bulk-delete links by ID.

| Field | Type | Required | Description |
|---|---|---|---|
| `ids` | `string[]` | ✅ | Array of link IDs to delete |

**Response:** `{ "success": true }`

---

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

---

## 📦 Scripts Reference

| Script | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Generate Prisma client & build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm tinybird:dev` | Start Tinybird local dev environment |
| `pnpm tinybird:deploy` | Deploy Tinybird data pipelines |

---

## 🚢 Deployment

Zipply includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment. The recommended hosting platform is [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project on Vercel.
3. Set all environment variables in the Vercel dashboard.
4. Vercel will automatically run `prisma generate && next build` on each deploy.

> **Note:** Ensure your PostgreSQL database is accessible from the deployment environment (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
