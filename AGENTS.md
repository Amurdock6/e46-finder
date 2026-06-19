# AGENTS.md — Working With This Repo

This document provides conventions and guardrails for agents (and humans) making changes. It complements `docs/ARCHITECTURE.md` and `docs/LISTINGS_DATA_FLOW.md`.

Scope
- Applies to the entire repository unless a more deeply nested `AGENTS.md` overrides it.

Quick Links
- Architecture overview: docs/ARCHITECTURE.md
- Listings data flow: docs/LISTINGS_DATA_FLOW.md

Repo Layout (frontend SPA)
- `src/` — React app (Create React App). Note: folder name `componets` is intentional; do not rename without a coordinated refactor.
- `public/` — Static assets.
- `docs/` — Project documentation.
- Backend runs as a separate service; this repo only references it via `REACT_APP_BACKEND_URL`.

Coding Standards (Frontend)
- Keep diffs minimal and focused; avoid renames or broad refactors unless requested.
- Use existing patterns (functional React components, hooks).
- Prefer clarity over cleverness; avoid one-letter variable names.
- Do not add license or copyright headers unless requested.
- Do not introduce new formatters or linters; match existing style.

Data Contracts (Do Not Break)
- `/scrape` response items expected by the UI (see docs/LISTINGS_DATA_FLOW.md):
  - `listingId: string` (stable id from `link + car`), `car`, `link`, `price`, `picture`.
  - `timeLeftText: string` (source label, e.g., "3 days" or "hh:mm:ss").
  - `expiresAt: Date` (absolute expiry), `site`, `mileage`, `location`, `trans` or `transmission`.
- Saved listings:
  - Include absolute `timeleft: Date` and use per-user `listingId` (hash of `userId|link`).
- If you must change field names or shapes, update both docs and all call sites in `src/componets/Listings/*` and `src/pages/*`.

Time Handling Rules (Consistency With Backend)
- Day labels displayed in the grid should match the marketplace labeling. The scraper adjusts day-based labels by +1 day; the UI uses that text for parity.
- Do not add +1 day when rendering ISO expiry timestamps (saved listings). Account page should not show an extra day.
- When a saved listing switches to hh:mm:ss, the UI sends `POST /savelisting/update` to persist a precise absolute expiry.

Caching and Warming Behavior
- Frontend caches array in `localStorage['listings']` to soften reloads.
- On `GET /scrape` returning `202 []` (warming), keep existing cache and poll; do not overwrite cache with empty results.

Environment and Secrets
- Frontend expects `REACT_APP_BACKEND_URL` in `.env`.
- Never store JWTs in `localStorage`. UI reads a non-HTTPOnly `LoggedIn` cookie for display state only.

Performance and UX
- Keep bundle size reasonable; reuse existing components and CSS.
- Avoid expensive re-renders; use stable keys `listingId || link || index` in lists.

Documentation Discipline
- Any change to data shapes, timer semantics, or endpoint usage must be reflected in:
  - docs/LISTINGS_DATA_FLOW.md (contracts, TTL, flows)
  - docs/ARCHITECTURE.md (high-level overview)

Backend Notes (for cross-repo work)
- Scraped cache uses a TTL on `expiresAt`; saved listings use TTL on `timeleft`.
- `/scrape` should be non-blocking under cold cache: start background scrape and return `202 []` with `Retry-After`.
- Avoid coupling saved listings to scraped cache IDs; uniqueness is per user+link.

Agent Workflow Tips
- Before editing, skim docs in `docs/` to align with current behavior.
- Prefer small, verifiable changes. If a change spans multiple files, outline steps and keep commits logically grouped.
- When adding new features, also add/update docs under `docs/`.

Out of Scope
- Do not add third-party trackers or analytics unless explicitly asked.
- Do not redesign navigation or rename `componets` unless explicitly asked.

