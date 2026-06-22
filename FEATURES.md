# ARSPocket — Feature Registry

Last updated: 2026-06-22

---

## Stack

- **Framework**: Next.js 16.2.9 (App Router, Turbopack)
- **Language**: TypeScript 6
- **Database**: Prisma 7 + Neon PostgreSQL (PrismaNeonHttp adapter)
- **Auth**: Clerk v7 (middleware at `proxy.ts` — never `middleware.ts`)
- **UI**: Tailwind 4, Radix UI, shadcn/ui pattern, Recharts 3.8
- **Storage**: S3-compatible (receipts)

---

## Existing Features (implemented)

### Transactions
- **Route**: `/dashboard/income`, `/dashboard/outcome`
- **Actions**: `app/actions/transactions.ts`
- **Models**: `Transaction` (type INCOME/OUTCOME, amount, category, date, lat/lng, isRecurring, isAnomaly)
- **Notes**: Supports tagging via `Tag` + `TransactionTag` M:M. Has `isAnomaly` flag (no UI surfacing it yet).

### Savings Goals
- **Route**: `/dashboard/savings`
- **Actions**: `app/actions/savings.ts`, `app/actions/savings-goals-v2.ts`
- **Models**: `SavingsGoal`, `GoalMilestone`
- **Notes**: Progress bar, target date, color. Milestone support.

### Goals (v3)
- **Route**: `/dashboard/goals`
- **Actions**: `app/actions/goals.ts`
- **Models**: `Goal`, `GoalContribution`
- **Notes**: Multi-currency, contributions log, deadline.

### Bills Tracker
- **Route**: `/dashboard/bills`
- **Actions**: `app/actions/bills.ts`
- **Models**: `Bill` (name, amount, dueDay, frequency, isPaid, nextDueDate)
- **Notes**: In sidebar nav (Utilities group).

### Budget Management
- **Route**: `/dashboard/budget`
- **Actions**: `app/actions/budgets.ts`
- **Models**: `Budget` (category, amount, period WEEKLY/MONTHLY/YEARLY, alertSentAt80, alertSentAt100)
- **Notes**: In sidebar nav (Utilities group). Toast alerts at 80%/100%; `Notification` records created in-app.

### Transaction Calendar
- **Route**: `/dashboard/calendar`
- **Notes**: Shows transactions only. Bills/goals/habits not integrated.

### Habits Tracker
- **Route**: `/dashboard/habits`, `/dashboard/habits/stats`
- **Actions**: `app/actions/habits.ts`
- **Models**: `Habit`, `HabitLog`, `UserStreak`
- **Notes**: In sidebar nav (Utilities group).

### Resource Library (Bookmarks)
- **Route**: `/dashboard/library`, `/dashboard/library/archive`, `/dashboard/library/favorites`, `/dashboard/library/trash`
- **Actions**: `app/actions/library.ts`
- **Models**: `ResourceBookmark`, `BookmarkCollection`
- **Notes**: In sidebar nav (Utilities group). Soft-delete with trash.

### Spending Map (Geo)
- **Route**: `/dashboard/map`
- **Notes**: In sidebar nav (Utilities group). Requires lat/lng on transactions.

### Net Worth Tracker
- **Route**: `/dashboard/net-worth`
- **Actions**: `app/actions/net-worth.ts`
- **Models**: `NetWorthSnapshot`, `NetWorthItem` (ASSET or LIABILITY, amount, currency)
- **Notes**: In sidebar under Planning. No trend line chart connecting snapshots over time.

### Receipts Vault
- **Route**: `/dashboard/receipts`
- **Actions**: `app/actions/receipts.ts`
- **Models**: `Receipt` (transactionId, fileKey, mimeType, deletedAt)
- **Notes**: In sidebar nav (Utilities group). S3-backed storage.

### Financial Reports
- **Route**: `/dashboard/reports`
- **Notes**: Monthly income vs. expenses. CSV export via `GET /api/export`. No annual rollup.

### Financial Tasks (Kanban)
- **Route**: `/dashboard/tasks`
- **Actions**: `app/actions/tasks.ts`
- **Models**: `FinancialTask` (status BACKLOG/TODO/IN_PROGRESS/DONE, priority, dueDate, labels)
- **Notes**: In sidebar nav (Utilities group).

### Tags
- **Actions**: `app/actions/tags.ts`
- **Models**: `Tag`, `TransactionTag`
- **Notes**: M:M on transactions. No tag-based filter view in UI.

### Dashboard
- **Route**: `/dashboard`
- **KPIs**: Balance (all-time), Monthly Income, Monthly Expenses, Active Savings Goals count
- **Widgets**: Recent Transactions (last 5), Savings Goals (top 3 with progress), Monthly Chart (6-month income/expenses bar), Cash Flow Projection (30/60/90-day toggle)

### Recurring Transactions
- **Route**: `/dashboard/recurring`
- **Actions**: `app/actions/recurring.ts`
- **Models**: `Transaction.isRecurring`
- **Notes**: Management page with pause/resume/delete. In sidebar nav (Utilities group).

### Custom Categories
- **Route**: `/dashboard/categories`
- **Actions**: `app/actions/categories.ts`
- **Models**: `Category` (userId, name, type: income|outcome|both, color?, @@unique[userId,name])
- **Notes**: User-defined categories merged with static lists via `getMergedCategories` in `lib/categories.ts`. 50-category limit per user.

### Notification Center
- **Actions**: `app/actions/notifications.ts`
- **Models**: `Notification` (userId, type NotificationType, title, body, isRead, metadata Json?)
- **Notes**: Bell icon in Navbar header; Popover panel with mark-read/mark-all-read. Budget alerts (80%/100%) create records automatically.

---

## Critical Gaps (built but broken/incomplete)

| # | Gap | Status | Details |
|---|-----|--------|---------|
| G1 | **Sidebar missing 7 routes** | ✅ Fixed | Bills, Budget, Habits, Tasks, Library, Map, Receipts added to Utilities nav group |
| G2 | **Settings page orphaned** | ✅ Fixed | `/dashboard/settings` route created; `SettingsContent` shared by page and modal |
| G3 | **Recurring transactions has no management UI** | ✅ Fixed | `/dashboard/recurring` page with pause/resume/delete |
| G4 | **Budget alerts undelivered** | ✅ Fixed | Toast alerts at 80%/100%; `Notification` records created for in-app center |
| G5 | **Net Worth has no trend chart** | ✅ Already done | Was implemented before this audit |
| G6 | **Anomaly flag has no UI** | ✅ Fixed | `AnomalyBadge` + `AnomalyToggle` on income/outcome pages |
| G7 | **Tags have no filter UI** | ✅ Fixed | `TagFilter` multi-select on income/outcome pages (OR semantics) |

---

## Missing Features

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| M1 | **Transaction search / full-text filter** | High | ✅ Done | Search bar on income/outcome pages; was already partially implemented |
| M2 | **CSV export** | High | ✅ Done | `GET /api/export` — no take limit, auth guard, Content-Disposition header |
| M3 | **CSV import** | Medium | ✅ Done | `ImportButton` was already implemented; added to outcome page |
| M4 | **Custom categories** | Medium | ✅ Done | `Category` model + CRUD actions + `/dashboard/categories` page; `getMergedCategories` merges static + user categories |
| M5 | **In-app notification center** | Medium | ✅ Done | `Notification` model + bell + panel (Popover); budget alerts create records at 80%/100% |
| M6 | **Multi-currency dashboard** | Medium | ✅ Done | `CurrencySelector` + `getDashboardStats(baseCurrency?)` using existing FX layer; stale-rates warning |
| M7 | **Year-end / annual financial summary** | Low | ✅ Done | `getAnnualReport` action + `AnnualSummary` component (Recharts + 5 cards); `?year=YYYY` param on reports page |
| M8 | **Savings auto-contribute** | Low | ✅ Done | `linkedGoalId` FK on Transaction (migration); atomic createTransaction creates GoalContribution; `AutoContributeSection` on goals page. Note: unlinking does not reverse the contribution |
| M9 | **Calendar enrichment** | Low | ✅ Done | Calendar fetches bills + goal deadlines in parallel; blue dot = bill due, amber dot = goal deadline; legend added |
| M10 | **Dark mode toggle** | Low | ✅ Already done | `ThemeToggle` component exists and is rendered in Navbar |
| M11 | **PDF export** | Low | ✅ Done | `@media print` CSS in globals.css; `PrintButton` component on reports page; no new dependencies |
| M12 | **PWA manifest** | Low | ✅ Done | `app/manifest.ts` + `public/icons/` PNGs; manifest-only (no service worker) |

---

## Hard Rules

- **No AI features** unless the user explicitly requests them (`AIInsight` model exists but is unused by policy)
- **Landing page is locked** — do not modify `app/page.tsx` or `components/landing/`
- **Middleware is `proxy.ts`** at root — never create `middleware.ts`
- **Named arrow function exports only** — `export const X = () => {}` for all components
- **Pages/layouts** still use `export default` on a separate line after the named const
