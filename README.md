# MediFlow AI — Healthcare Operations Dashboard

A production-oriented healthcare operations dashboard built with **TanStack Start**
(SSR), **React 19**, **Vite 7**, **Tailwind v4**, and **shadcn/ui**. Data is served
through a typed mock layer that is swap-ready for a real backend.

## Getting started

```bash
npm install          # or: bun install
npm run dev          # start the dev server
npm run build        # production build
npm run preview      # preview the production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

Copy `.env.example` to `.env` for local configuration (validated in `src/lib/env.ts`).

## Routes

| URL | Description |
| --- | --- |
| `/` | Public marketing landing page |
| `/app` | Dashboard overview (KPIs, charts, activity) |
| `/app/patients` | Patient records table |
| `/app/appointments` | Today's appointments |
| `/app/billing` | Invoices & revenue-cycle stats |
| `/app/analytics` | Operational analytics charts |

## Project structure

```
src/
├── routes/              # TanStack file-based routing (URL = file path)
│   ├── __root.tsx       # app shell, providers, base metadata
│   ├── index.tsx        # public landing (/)
│   └── app/             # authenticated dashboard
│       ├── route.tsx    # AppShell layout (sidebar + topbar)
│       ├── index.tsx    # overview
│       └── <feature>/index.tsx
│
├── features/            # domain modules — the core of the app
│   └── <feature>/
│       ├── components/  # feature UI (incl. the page component)
│       ├── api/         # *.api.ts (fetchers) + *.queries.ts (hooks)
│       ├── types.ts     # Zod schemas + inferred types (the API contract)
│       └── index.ts     # public barrel
│
├── components/
│   ├── ui/              # shadcn primitives (theme source — do not restyle)
│   ├── layout/          # AppShell, Sidebar, Topbar
│   └── common/          # shared cross-feature: SectionCard, PageHeader
│
├── lib/
│   ├── api/mock.ts      # mock-fetch helper (swap point for real backend)
│   ├── query/           # QueryClient factory + query-key factory
│   ├── env.ts           # Zod-validated client env
│   └── utils.ts         # cn() etc.
│
├── constants/           # navigation config, etc.
├── hooks/               # global hooks
└── styles.css           # Tailwind theme tokens (single source of design truth)
```

## Conventions

- **Feature-first.** Anything domain-specific lives under `features/<name>/`.
  Cross-feature UI goes in `components/common`; layout in `components/layout`.
- **Data layer.** Components never hold data literals. Each feature exposes
  TanStack Query hooks (`useKpis`, `usePatients`, …) backed by `api/*.api.ts`.
  To connect a real backend, replace the body of each fetcher with a `fetch()`
  or server-fn call — schemas, hooks, and components stay unchanged.
- **Query keys** are centralized in `src/lib/query/queryKeys.ts`.
- **Theme** is defined entirely in `src/styles.css` and `components/ui/*`.
  Reuse tokens (`bg-card`, `text-muted-foreground`, `var(--primary)`); don't
  hardcode colors.
- **Loading states.** Query-backed views render `Skeleton`s while pending.

## Tech stack

TanStack Start · React 19 · Vite 7 · Tailwind v4 · shadcn/ui · TanStack Query ·
Zod · React Hook Form · Recharts · Framer Motion · Lucide.
