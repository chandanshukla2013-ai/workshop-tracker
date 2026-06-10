# AI Agent Instructions for Workshop Tracker

## Project overview
- Single-page React application built with Vite.
- Uses Firebase Firestore and Firebase Auth from `src/firebase.js`.
- Styling is implemented with Tailwind CSS and `src/index.css`.
- The main application logic and UI live in `src/App.jsx`.
- No backend server or automated tests are present in this repository.

## Key commands
- `npm install` — install dependencies
- `npm run dev` — start Vite development server
- `npm run build` — build production assets
- `npm run lint` — run ESLint across the project

## Important files
- `src/App.jsx` — primary UI, state, form handling, and Firestore integration
- `src/firebase.js` — Firebase initialization and exports
- `src/index.css` — global styles and Tailwind base styles
- `tailwind.config.js` / `postcss.config.js` — Tailwind setup
- `vite.config.js` — Vite configuration for React
- `eslint.config.js` — lint rules, including React hooks and Vite React Refresh

## Environment and configuration
- Firebase configuration values are loaded from Vite environment variables:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Do not hardcode Firebase credentials or secrets in the repo.

## Agent guidance
- Keep changes minimal and idiomatic for React + Vite.
- Prefer refactoring large component logic from `src/App.jsx` into clearer subcomponents when needed.
- Use React hooks correctly and avoid mutating state directly.
- Do not assume TypeScript; the project is plain JavaScript with JSX.
- Preserve Tailwind utility class usage for styling consistency.
- If introducing new functionality, follow the existing React + Firebase pattern.
- When fixing issues, verify behavior with `npm run dev` and `npm run lint`.

## Notes for reviewers
- This repository is a frontend-only workshop tracker app.
- There is no `server` or `api` folder; all data handling occurs via Firebase client SDK.
