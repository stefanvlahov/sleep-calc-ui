# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (proxies /api → localhost:8080)
npm run build      # Type-check + production build → dist/
npm run lint       # ESLint with type-aware rules
npm run test       # Vitest unit tests (watch mode)
npm run preview    # Preview production build locally
```

Run a single test file:
```bash
npx vitest run src/components/SleepTracker.test.tsx
```

## Architecture

**Stack:** React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 + React Router v7 + Recharts

### Routing (`src/App.tsx`)
Route guard is a simple ternary on the `token` from `AuthContext`. If authenticated, the app renders dashboard/log-sleep/history/reports routes; otherwise only login/forgot-password/reset-password. Both sides redirect unmatched paths to their respective homes.

### Auth (`src/context/AuthProvider.tsx` + `src/hooks/useAuth.ts`)
Token is stored in `localStorage` under `authToken`. `AuthProvider` wraps the entire app (in `main.tsx`) and exposes `{ token, login, logout }` via context. Components access auth only via the `useAuth()` hook.

### API Layer (`src/utils/api.ts`)
All authenticated requests go through `fetchWithAuth`, which:
- Prepends `import.meta.env.VITE_API_URL` to the URL (empty string in dev — requests hit Vite's proxy)
- Attaches `Authorization: Bearer <token>` header
- Calls `logout()` automatically on 401/403 responses

In development, Vite proxies all `/api` requests to `http://localhost:8080`. Production needs `VITE_API_URL` set to the backend origin.

### Backend API Contract
All sleep endpoints require `Authorization: Bearer <token>`.

| Method | Path | Body / Params | Response |
|--------|------|---------------|----------|
| POST | `/api/auth/register` | `{ username, password }` | 200 OK |
| POST | `/api/auth/login` | `{ username, password }` | `{ token }` |
| GET | `/api/sleep/state` | — | `{ sleepDebt, sleepSurplus }` |
| POST | `/api/sleep` | `{ timeSlept: "HH:MM", date: "YYYY-MM-DD" }` | `{ sleepDebt, sleepSurplus }` |
| GET | `/api/sleep/history` | — | `SleepHistoryEntry[]` |
| GET | `/api/sleep/history/range` | `?from=YYYY-MM-DD&to=YYYY-MM-DD` | `SleepHistoryEntry[]` |
| GET | `/api/reports/weekly` | — | `WeeklyReportDTO` |
| GET | `/api/reports/monthly` | — | `MonthlyReportDTO` |
| GET | `/api/reports/export` | `?from=YYYY-MM-DD&to=YYYY-MM-DD` | CSV blob |

Dates sent to the backend use a timezone offset calculation to produce a consistent `YYYY-MM-DD` string regardless of local timezone.

### State Management
No Redux or Zustand — auth is global via Context, everything else is `useState`/`useEffect` local to the page component. Pages own their fetch lifecycle (loading flags, error state, data).

### Testing
Tests are co-located (`.test.tsx` next to the component). The setup file (`src/setupTests.ts`) adds jest-dom matchers and stubs `window.alert`. Test environment is jsdom.

Auth forms (`LoginForm`, `RegistrationForm`, `ForgotPasswordForm`, `ResetPasswordForm`) are each in their own file to avoid react-refresh fast-refresh warnings.
