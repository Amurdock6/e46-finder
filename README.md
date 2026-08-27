E46 Finder — Frontend

Overview
- React SPA (Vite). See docs/ARCHITECTURE.md for a deeper dive.
- Backend API is separate (Node/Express + MongoDB). Original backend repo: https://github.com/Amurdock6/E46_BackEnd

Quick Start
- Requirements: Node 20.19+ recommended
- Env: create `.env` in project root with:
  - `REACT_APP_BACKEND_URL=http://localhost:5000` (or `VITE_BACKEND_URL=http://localhost:5000`)
  - `REACT_APP_GOOGLE_CLIENT_ID=...apps.googleusercontent.com` (or `VITE_GOOGLE_CLIENT_ID`) to enable Sign in with Google
- Install and run:
  - `npm install`
  - `npm start`

Key Features
- Listings page: fetches `/scrape` and shows all listings.
- Saved listings: Account page fetches `/accountpagesavedlistings`.
- Countdown rules: mirrors BaT behavior — show days until the last 24 hours, then switch to hh:mm:ss. Saved listings get their absolute expiry updated when switching to hh:mm:ss.

Where To Look
- `src/pages/LandingPage.js` — hero image, scroll indicator, listings container
- `src/componets/Listings/Listings.js` — fetch + cache scraped listings, saved markers
- `src/componets/Listings/Listing.jsx` — single card, save/unsave, countdown mode selection
- `src/componets/Listings/CountDown.js` — renders days vs hh:mm:ss
- `src/componets/Listings/CountDownTimerUtils.js` — countdown math using dayjs
- `src/pages/Account.js` — saved listings view
- `src/componets/NavBar/*` — navigation + mobile menu (scroll locked when open)

Deploy
- This app is deployable to Netlify or any static host.
- Production builds are written to `dist/`.
- Ensure CORS and cookie settings in the backend allow your domain and HTTPS.
- Configure the same Web application client ID in the frontend and backend, and add each frontend origin to the client's Authorized JavaScript origins in Google Cloud.

Troubleshooting
- Listings not updating: clear `localStorage['listings']`, ensure backend `/scrape` is reachable.
- Timers off by a day (days mode): verify backend days → `expiresAt` padding rules; frontend relies on `timeLeftText` for day labels and ISO ms diff for hh:mm:ss.
