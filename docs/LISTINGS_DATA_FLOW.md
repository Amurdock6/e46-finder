E46 Finder — Listings Data Flow

Overview
- Source: Bring a Trailer E46 keyword page is scraped via headless Chrome.
- Backend: Normalizes results and persists a cache in MongoDB with TTL expiry.
- Frontend: Fetches from `GET /scrape`, shows days or hh:mm:ss, and polls while backend warms.
- Saved items: Per‑user saved listings are stored with their own TTL, independent of scraped cache.

High‑Level Sequence
1) Frontend requests `GET /scrape`.
2) Backend returns recent cached rows (last hour). If empty, it starts a background scrape and returns `202 []` with `Retry-After: 5`.
3) Frontend polls until real data arrives, then renders grid and caches the array in `localStorage`.
4) When user saves/unsaves, UI calls `POST /savelisting` (toggle). If a saved listing later switches to hh:mm:ss on the source, UI calls `POST /savelisting/update` to set a precise absolute expiry.

Scraping (middleware/scraper.js)
- Tech: `puppeteer-core` launches Chrome from `GOOGLE_CHROME_BIN`, using Linux‑friendly args; blocks images/trackers to reduce cost.
- Target: `https://bringatrailer.com/bmw/e46/?q=e46%2F`.
- Extract per card: `car`, `link`, `price` (or "Open for Bidding"), `picture`, and countdown label `timeLeft`.
- Day label adjustment: If the countdown is day‑based (no colons) and matches `/(\d+)\s*day(s)?/i`, the label is increased by +1 day for UI parity (e.g., "2 days" becomes "3 days"). hh:mm:ss strings are not changed.
- Enrichment: For the first N listings (`SCRAPE_ENRICH_LIMIT`, default 5), requests each detail page with axios to parse `location`, `mileage`, and `transmission` from the Essentials area.
- Output object shape: `{ site: 'Bring a Trailer', car, link, price, picture, timeLeft, location, trans, mileage, postNum }`.
- Watchdog: A timeout (`SCRAPE_TIMEOUT_MS`, default ~25s) aborts long runs. Browser is always closed in finally.

Backend Cache and TTL (model/scrapedListings.js and app.js)
- Model fields of cached docs:
  - `listingId: string` — stable SHA‑256 of `link + car`.
  - `timeLeftText: string` — the label from the scraper (possibly day‑adjusted).
  - `expiresAt: Date` — absolute expiration derived from `timeLeftText`.
  - Display: `car, link, price, picture, mileage, location, transmission, site`.
  - `scrapedAt: Date` — when this row was written (used for a 1‑hour recency check).
- TTL index: `{ expiresAt: 1 }` with `expireAfterSeconds: 0` automatically removes a row when `expiresAt` passes.
- Cache policy:
  - `GET /scrape` reads rows where `scrapedAt >= now - 1h`.
  - If found, returns them immediately (200).
  - If none found, starts a background scrape (deduped by `isScraping/scrapePromise`), sets `X-Scrape-Status: warming` and `Retry-After: 5`, then returns `202 []` quickly.
  - When the scrape completes, the backend replaces the entire cache: `deleteMany({})` then `insertMany(processedListings)`.
- Day/hh:mm:ss to absolute time:
  - Text with "N day(s)" → `expiresAt = now + N*24h` (N is already adjusted by the scraper).
  - `hh:mm:ss` → exact milliseconds.
  - `mm:ss` → exact milliseconds.

API Contracts
- GET `/scrape`
  - 200 body: `[{ listingId, car, link, price, picture, timeLeftText, expiresAt, site, mileage, location, transmission, scrapedAt }]`.
  - 202 body: `[]` while warming; headers: `X-Scrape-Status: warming`, `Retry-After: 5`.

- GET `/accountpagesavedlistings`
  - 200 body: `[{ id, link, car, price, picture, timeleft: Date, site, mileage, location, transmission, postNum, listingId }]` or `[]` if unauth.

- POST `/savelisting`
  - Auth via `AccessToken` cookie.
  - Request JSON includes the listing fields and `timeleft` (string label or hh:mm:ss).
  - Toggle behavior: If `{ id:userId, link }` exists → delete and return `{ action: 'removed' }`. Else create and return `{ action: 'saved' }`.
  - Absolute TTL stored in `timeleft: Date` is computed from the provided text or hh:mm:ss.

- POST `/savelisting/update`
  - For saved listings when UI time flips to hh:mm:ss. Body includes `{ link, timeleft: 'hh:mm:ss' }`.
  - Backend parses hh:mm:ss (or mm:ss) and sets a new `timeleft` Date without extending beyond an existing earlier expiry.

Frontend Population and Caching (src/componets/Listings/*.js)
- Listings page (`Listings.js`):
  - Loads cached array from `localStorage['listings']` to soften reloads.
  - Fetches `GET /scrape` with credentials; if it receives 202/empty array, it keeps the existing cache, shows a spinner (when empty), and polls every ~5s.
  - On real data, updates state and overwrites `localStorage['listings']` with the fresh array.
  - Computes an `alreadySaved` boolean array by comparing listing `link` with the set from `GET /accountpagesavedlistings`.
  - Renders `Listing` with a stable `key` of `listingId || link || index`.
  - Passes time to child as `timeleft={timeLeftText || timeLeft || expiresAt}`.

- Listing card (`Listing.jsx`):
  - Derives a countdown target (ms) from:
    - `"N day(s)"` → day mode; one day uses a static label.
    - ISO date string (from saved listings) → compute `expiry - now` without adding an extra day.
    - `hh:mm:ss` or `mm:ss` → sub‑day timer.
    - Unrecognized/missing → shows a fallback message.
  - Save/Unsave:
    - Click calls `POST /savelisting` (with credentials). Response `{ action: 'saved'|'removed' }` toggles the icons.
  - When `alreadySaved` and time string contains a colon, it calls `POST /savelisting/update` once to persist a precise expiry.

- Countdown UI (`CountDown.js`):
  - Modes: days only, one‑day label passthrough, or hh:mm:ss with ticking.
  - For days mode, prefers day count from `timeleft` text to mirror the marketplace; falls back to computed remaining days.

Saved Listings Store and TTL (model/savedlistings.js)
- Document shape: `{ id:userId, link, car, price, picture, timeleft: Date, site, mileage, location, transmission, postNum, listingId }`.
- TTL: `timeleft` has an index `{ expires: 0 }`, so the document is removed right when `timeleft` passes.
- Unique key: `listingId` is a per‑user stable hash of `userId|link` to satisfy an existing unique index. This does not point to scraped cache IDs.

IDs and Relationships
- Scraped cache: `listingId = sha256(link + car)` provides a stable key for the grid.
- Saved listings: `listingId = sha1(userId|link)` enforces uniqueness per user+link.
- Cascade note: A `post('findOneAndDelete')` hook on scraped cache removes saved listings that referenced `listingId` in a previous design; it is harmless now since saved listings no longer reference scraped `listingId`.

Concurrency and Reliability
- Single‑process coordination: `isScraping` and a shared `scrapePromise` dedupe concurrent `/scrape` calls.
- Warmup behavior: Empty cache returns `202 []` quickly; UI polls. `X-Scrape-Status` and `Retry-After` guide the client.
- Background scrape replaces the entire cache on success; errors are logged and flags reset.

Environment and Config
- `GOOGLE_CHROME_BIN`: absolute path to Chrome/Chromium for `puppeteer-core`.
- `SCRAPE_ENRICH_LIMIT`: number of detail pages to enrich per scrape (default 5).
- `SCRAPE_TIMEOUT_MS`: watchdog to abort long scrapes (default ~25000 ms).
- `NODE_ENV`: affects backend cookie options; unrelated to scrape logic itself.

Example Flows
- Cold start:
  1) UI GET `/scrape` → 202 `[]` (warming).
  2) UI polls in 5s; meanwhile backend scrapes and writes cache.
  3) UI GET `/scrape` → 200 `[ ...listings ]`, caches in `localStorage`.

- Save a listing while source shows days:
  1) UI POST `/savelisting` with `timeleft: "3 days left"`.
  2) Backend parses days and stores `timeleft` as an absolute Date; TTL will remove after expiry.
  3) Later, when source shows `12:34:56`, UI POST `/savelisting/update` so backend sets a precise absolute expiry.

Operational Notes
- If you run multiple backend instances, `isScraping` is process‑local; add a distributed lock to avoid duplicate scrapes.
- TTL deletions are best‑effort and may lag by up to a minute depending on MongoDB’s TTL monitor cadence.
- Frontend avoids overwriting a non‑empty cache with warming `[]` responses.

User-Created Listings
- Create flow (frontend):
  - Protected page at `/create-listing` (see `pages/CreateListing.js`) reachable from the Account page. Requires login and collects title, description, transmission (manual/automatic), location, duration in days, and 1-5 image URLs.
  - Submits `POST /userlistings` with body `{ title, description, transmission, location, durationDays, images: string[1..5] }`. On success, the UI clears the form and redirects back to Account.
- Display flow (frontend):
  - `Listings.js` merges data from `GET /scrape` with data from `GET /userlistings` and caches user-created listings in `localStorage['userListings']`.
  - Cards render with `Listed On: e46finder.com` and `Listed by {listedBy}` when provided.
  - Fields expected from `GET /userlistings`: `listingId` (stable), `link` (permalink used for key/save identity), `site: 'e46finder.com'`, `listedBy` (username), `car` or `title`, `description`, `picture` (first image) and optional `images`, `transmission`, `location`, `timeLeftText` (e.g., "7 days") and/or absolute `expiresAt`.
- Backend contract asks:
  - Implement `POST /userlistings` (auth via `AccessToken` cookie) to create a row with TTL based on `durationDays` (`expiresAt = now + durationDays*24h`; no +1 day padding).
  - Implement `GET /userlistings` to return only non-expired listings with the fields above; TTL or query filter should exclude expired rows.
  - Set `link` to a stable permalink (e.g., `https://e46finder.com/listings/{listingId}`) so Save/Unsave uniqueness remains consistent.
