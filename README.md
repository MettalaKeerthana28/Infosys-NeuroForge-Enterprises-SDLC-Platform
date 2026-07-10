# NeuroForge — AI-First Enterprise SDLC Platform

Enterprise SDLC platform built on **TanStack Start + TypeScript + Tailwind v4**,
with role-based dashboards, organization / team / project management and an
AI-first product surface (NeuroBot).

## Quick start

```bash
bun install     # or: npm install
bun run dev     # or: npm run dev
bun run build   # or: npm run build
```

Copy `.env.example` to `.env` to point at your backends:

```
VITE_AUTH_API_URL=http://localhost:8081
VITE_CORE_API_URL=http://localhost:8080
VITE_USE_MOCK_DATA=true
```

When `VITE_USE_MOCK_DATA=true` (default), the app runs entirely on in-browser
mock services — auth included — so you can preview every role without a
backend running.

## Demo credentials (mock mode)

Password for every account: **`Password@123`**

| Email | Role |
| --- | --- |
| super@neuroforge.dev | Super Admin |
| admin@neuroforge.dev | Org Admin |
| pm@neuroforge.dev | Project Manager |
| dev@neuroforge.dev | Developer |
| qa@neuroforge.dev | QA Tester |
| stake@neuroforge.dev | Stakeholder |

Use the "Preview: <role>" switcher in the header to hot-swap roles without
signing out.

## Architecture

- `src/routes/` — file-based routes (public + `_app/` protected layout)
- `src/components/` — reusable UI (brand, layout, common, auth)
- `src/lib/auth/` — JWT decode, token storage, permissions, AuthContext
- `src/lib/api/` — auth API client + mock organization / project services
- `src/mocks/` — seed data for organizations, teams, members, projects
- TanStack Query owns caching; loaders remain pure Query primers where used
- Sonner for toasts, Recharts for charts, react-hook-form + Zod for forms

## Real backend

Set `VITE_USE_MOCK_DATA=false` and the auth client calls the Spring Boot
auth service (`/auth/*`) at `VITE_AUTH_API_URL`. Google OAuth redirects via
`${VITE_AUTH_API_URL}/oauth/google-login`. Organizations / projects remain
mocked until their real endpoints exist.
