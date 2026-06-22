# ARSPocket — Take Control of Your Finances

> Your money, your rules. A modern personal finance platform built for clarity, habits, and long-term financial freedom.

---

## What is ARSPocket?

ARSPocket is a full-featured personal finance app that goes beyond simple expense tracking. It combines transaction management, smart budgeting, goal planning, daily financial habits, and net worth tracking into one clean, focused platform — built for people who take their money seriously.

No AI gimmicks. No noise. Just the tools you actually need.

---

## Features

### Income & Expenses

Log transactions with categories, tags, and anomaly flagging. Full-text search, multi-filter (period, category, anomaly), CSV import/export with active-filter passthrough.

### Budget Management

Weekly/monthly/yearly budgets per category. Toast alerts at 80% and 100% spend. In-app notifications logged to a Notification Center.

### Bills Tracker

Schedule recurring and one-time bills by due day. Calendar view with paid/unpaid dot indicators.

### Savings Goals

Multi-currency goals with milestones, deadlines, and a progress bar. Auto-contribute: link a recurring transaction to a goal so contributions are logged automatically.

### Recurring Transactions

Mark any transaction as recurring with frequency and end date. Dedicated management page to pause, resume, or delete.

### Net Worth

Asset and liability snapshots tracked over time with a trend chart.

### Goals v3

Deadline-driven goals with contribution history and multi-currency support.

### Habits Tracker

Daily habit check-ins with streak tracking and stats.

### Financial Tasks (Kanban)

BACKLOG → TODO → IN_PROGRESS → DONE board with priority, labels, and due dates.

### Reports & Analytics

- Monthly income/expense chart with category breakdown
- Annual summary: full-year bar chart (income / expenses / net) with year navigation
- Multi-currency dashboard: live FX conversion to any base currency
- CSV export and browser-print PDF (no extra dependencies)

### Calendar

Transaction calendar enriched with bill due dates (blue dot) and goal deadlines (amber dot).

### Spending Map

Geo-tag transactions and visualize spending patterns on an interactive map.

### Receipts Vault

S3-backed receipt upload linked to transactions.

### Resource Library

Save and organize financial bookmarks with collections, favorites, archive, and trash.

### Custom Categories

User-defined categories merged with built-in lists per transaction type (50 per user).

### Notification Center

Bell icon in the navbar showing budget alert notifications with mark-read / mark-all-read.

### PWA

Installable on mobile via manifest (manifest-only; no service worker).

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Language | TypeScript 6 |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma 7 (`@prisma/adapter-neon`) |
| Auth | Clerk v7 |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI, shadcn/ui pattern |
| Charts | Recharts 3.8 |
| Maps | MapLibre GL |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |
| Calendar | react-day-picker |
| i18n | next-intl (en / es, cookie-based) |
| Toasts | Sonner |
| File storage | AWS S3-compatible |
| Analytics | Vercel Analytics |
| Deployment | Vercel + Neon |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application
- An S3-compatible bucket (optional — for receipts vault)

### Environment Variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL=your_neon_connection_string

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# S3 (optional — receipts vault)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

### Install & Run

```bash
npm install

# Apply database migrations
npx prisma migrate deploy

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```text
app/
  dashboard/          # All authenticated routes
    income/           # Income transactions
    outcome/          # Expense transactions
    budget/           # Budget management
    bills/            # Bills tracker & calendar
    calendar/         # Enriched transaction calendar
    goals/            # Goals with auto-contribute
    reports/          # Monthly + annual reports
    recurring/        # Recurring transaction management
    categories/       # Custom categories CRUD
    map/              # Geo spending map
    net-worth/        # Net worth snapshots
    habits/           # Habit tracker
    tasks/            # Financial tasks kanban
    receipts/         # Receipts vault
    library/          # Resource library
    settings/         # Settings page
  actions/            # Server actions (one file per domain)
  api/
    export/           # GET — CSV export (bypasses row limit)

components/
  landing/            # Marketing landing page
  app-sidebar/        # Dashboard navigation
  notifications/      # Notification bell + panel
  reports/            # Charts and print button
  transactions/       # Transaction lists and filters
  goals/              # Auto-contribute UI
  tags/               # Tag filter
  bills/              # Bills calendar
  budget/             # Budget form and alerts

lib/
  categories.ts       # getMergedCategories() — always use instead of hardcoded arrays
  utils/fx.ts         # getFXRates() + normalizeToBase()

messages/
  en.json             # English translations
  es.json             # Spanish translations

prisma/
  schema.prisma       # Full database schema
```

---

## Architecture Notes

- **Auth middleware**: `proxy.ts` at the project root is the Clerk middleware. Never create `middleware.ts`.
- **Locale**: Stored in the `NEXT_LOCALE` cookie. Defaults to `"en"`. Toggle available on the landing page and in dashboard settings.
- **Component exports**: All components use `export const X = () => {}`. Page files use `const X = async () => {}; export default X;` on separate lines.
- **Category merging**: Always use `getMergedCategories(type, userCategories)` from `lib/categories.ts` — never hardcode category arrays.
- **FX layer**: `lib/utils/fx.ts` exports `getFXRates()` and `normalizeToBase()`. Used in reports and dashboard multi-currency view.
- **CSV export**: `GET /api/export` bypasses the `take: 50` cap in `getTransactions`. Query params: `type`, `from`, `to`, `category`, `search`, `anomaly`.

---

## Deployment

Deploy to Vercel with Neon as the database. In the Vercel build command, prepend the migration:

```bash
npx prisma migrate deploy && npx prisma generate && next build
```

---

## License

Private — not for public distribution.
