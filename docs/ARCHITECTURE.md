E46 Finder — Architecture Overview

Overview
- Frontend: React SPA (Create React App) hosted on Netlify. Communicates with a separate Node/Express backend via `REACT_APP_BACKEND_URL`.
- Backend: Node/Express + MongoDB (Mongoose). Provides authentication, scraping endpoint, and saved‑listings storage with TTL expiration.
- Data Flow: The Listings page fetches scraped listings from `/scrape`, shows days until last 24h, then shows hh:mm:ss. Saved listings are retrieved from `/accountpagesavedlistings`.

Key Frontend Components
- pages/LandingPage.js
  - Renders the hero image and Listings component.
  - Shows a bouncing chevron scroll indicator fixed near the bottom of the screen; hidden after 40% scroll and on mobile.

- componets/Listings/Listings.js
  - Fetches scraped listings from `GET /scrape` and caches in `localStorage`.
  - Fetches saved listings from `GET /accountpagesavedlistings` to mark already‑saved items in the grid.
  - Passes a stable key to Listing: `listingId || link || index`.
  - Passes `timeleft` preferring `timeLeftText` (e.g., "2 days" or "hh:mm:ss"), falling back to `expiresAt` for ISO timestamps.

- componets/Listings/Listing.jsx
  - Renders a single listing card.
  - Derives a countdown target in ms from either textual time (days/hh:mm:ss) or an ISO expiry.
  - When a listing is already saved and the text switches to hh:mm:ss, it sends `POST /savelisting/update` so the backend records a precise absolute expiration.
  - Save/Unsave toggles via `POST /savelisting` and hides/shows the appropriate icon.

- componets/Listings/CountDown.js
  - Displays one of three modes: days only, hh:mm:ss, or a fallback message if time cannot be determined.
  - In days mode, prefers the number from source text for UI parity with the listing site, and falls back to computed value.

- componets/Listings/CountDownTimerUtils.js
  - Computes remaining time to a future timestamp using dayjs.
  - Days are rounded up (ceil) so they match marketplace UI labeling. When using absolute expiry, we avoid extra padding on the Account page.

- pages/Account.js
  - Fetches `GET /accountpagesavedlistings` and renders saved items using the same Listing component.
  - Hides the Save button and shows the Unsave button for saved items.

- componets/NavBar/MobileNavigation.js
  - Mobile hamburger; locks page scrolling (`overflow: hidden`) while the menu is open.

- componets/NavBar/MobileNavLinks.js
  - Renders the appropriate link set for logged‑in vs logged‑out states using the `LoggedIn` cookie.

Backend Endpoints (consumed by the frontend)
- `GET /scrape`
  - Returns an array of current listings. Key fields:
    - `listingId: string` — stable id (link+car hash).
    - `timeLeftText: string` — text from the source (e.g., "3 days", "12:34:56").
    - `expiresAt: Date` — absolute expiration derived from the source.
    - Other display fields: `car, link, price, picture, mileage, location, trans(…)/transmission, site`.

- `GET /accountpagesavedlistings`
  - Returns the authenticated user’s saved listings. Includes an absolute `timeleft: Date` used for TTL expiry.

- `POST /savelisting`
  - Toggles a listing in the user’s saved list. Accepts the same listing fields and the textual time.

- `POST /savelisting/update`
  - Sent when the UI detects the source time becomes hh:mm:ss for a saved listing. Backend updates the absolute `timeleft` for accurate TTL.

Time and Countdown Behavior
- Alignment with BaT behavior:
  - Show days when the source site shows days.
  - Switch to hh:mm:ss when the source site switches to hh:mm:ss (final 24h).
- Frontend logic:
  - Uses `timeLeftText` to display days verbatim when available.
  - Uses a computed countdown for hh:mm:ss and ISO expirations.
- Backend logic (recommended):
  - For textual days N≥2: store `expiresAt = now + (N+1) days` so TTL never undercounts relative to a "2 days" label.
  - For "1 day": store `now + 1 day`.
  - For `hh:mm:ss`: compute exact milliseconds.

Auth and Cookies
- `AccessToken` (httpOnly) and `LoggedIn` (UI state) cookies are set by the backend.
- Frontend checks `LoggedIn` to show account actions and saved markers.

Local Development
- Set `REACT_APP_BACKEND_URL` in `.env` to point to your API.
- Run `npm start` to boot the frontend.
- The backend repo is separate; ensure it runs before testing features that call the API.

Troubleshooting Tips
- If listings don’t render or display the fallback timer message, confirm `/scrape` returns `timeLeftText` or `expiresAt` and clear `localStorage['listings']`.
- If saved listings on the Account page show +1 day, ensure the ISO expiry branch in `Listing.jsx` doesn’t add a day and backend expiration padding matches the rules above.

