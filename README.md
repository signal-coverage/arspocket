# ARSPocket — Take Control of Your Finances

> Your money, your rules. A modern personal finance platform built for clarity, habits, and long-term financial freedom.

---

## What is ARSPocket?

ARSPocket is a full-featured personal finance app that goes beyond simple expense tracking. It combines transaction management, smart budgeting, goal planning, and daily financial habits into one clean, focused platform — built for people who take their money seriously.

No subscriptions. No AI upsells. No noise. Just the tools you actually need.

---

## Features

### 💸 Income & Expense Tracking

Log every transaction with category, date, and description. Filter by period, import via CSV, and see your complete financial history at a glance.

### 📊 Budget Management

Set category budgets on weekly, monthly, or yearly cycles. As you record transactions, your remaining budget updates live — so you always know where you stand before you spend.

### 🗓️ Bills Tracker

Schedule recurring and one-time bills. Mark a bill as paid and ARSPocket automatically creates the corresponding OUTCOME transaction — no double entry, no friction.

### 🎯 Savings Goals & Milestones

Create savings goals with optional deadlines and track progress with a Gantt-style timeline. Break big goals into milestones and check them off as you go.

### 🔥 Habits & Daily Streak

Build lasting financial discipline with daily habit check-ins. Your streak counts every day you record activity — miss a day and it resets, keeping you honest.

### ✅ Financial Task Board

A Kanban board (Backlog → To Do → In Progress → Done) for every financial task you're managing — bills to dispute, forms to file, calls to make.

### 🗺️ Spending Map

Optionally geo-tag transactions and visualize where your money flows on an interactive map. Great for spotting location-based spending patterns.

### 🧾 Receipt Vault

Upload and attach receipt images directly to transactions via secure S3 storage. Keep your records organized and audit-ready.

### 📚 Resource Library

Save, organize, and tag financial articles, tools, and resources. Favorite the ones you return to. Archive or trash the rest.

### 📈 Reports & Analytics

Multi-currency reports with income vs. expense breakdowns, category analysis, and date range filtering. Understand your money across any time window.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Auth | Clerk v7 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 7 (HTTP adapter) |
| Storage | AWS S3 (presigned URL flow) |
| Mapping | MapLibre GL |
| UI | Tailwind CSS + shadcn/ui |
| Drag & Drop | @dnd-kit |
| Calendar | react-day-picker |
| Animations | Framer Motion |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database
- A [Clerk](https://clerk.com) application
- An AWS S3 bucket (for receipt storage)

### Environment Variables

Create a `.env.local` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# Database
DATABASE_URL=

# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

### Install & Run

```bash
npm install

# Push the schema to your database
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```text
app/
  dashboard/          # All authenticated routes
    budget/           # Budget management
    bills/            # Bills calendar & tracker
    goals/            # Gantt timeline
    habits/           # Daily check-in & streak
    tasks/            # Kanban board
    receipts/         # Receipt vault
    library/          # Resource bookmarks
    map/              # Spending map
    reports/          # Analytics
  actions/            # Server actions (data layer)
  api/upload/         # S3 presigned URL endpoint

components/
  app-sidebar/        # Navigation
  ui/                 # Shared UI primitives

prisma/
  schema.prisma       # Full database schema
```

---

## License

MIT
