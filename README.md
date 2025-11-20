<div align="center">
  <img src="public/logo.svg" alt="Wobot AI" height="72" />
  <h1>Wobot AI – Frontend Assignment (Cameras Dashboard)</h1>
  <p>React + TypeScript + Vite implementation of a camera management interface featuring filtering, searching, pagination, sorting, URL‑synced state, and optimistic status updates.</p>
  <p>
    <strong>Clean architecture · Typed API layer · Reusable hooks · Accessible UI</strong>
  </p>
</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Folder Structure](#folder-structure)
6. [State & Data Flow](#state--data-flow)
7. [API Layer](#api-layer)
8. [Getting Started](#getting-started)
9. [Environment Configuration](#environment-configuration)
10. [UI/UX Notes](#uiux-notes)
11. [Extensibility Ideas](#extensibility-ideas)
12. [Quality & Improvements](#quality--improvements)
13. [Screenshots](#screenshots)
14. [License / Usage](#license--usage)

---

## Overview

This project implements a lightweight Cameras Dashboard for the Wobot AI Frontend Developer assignment. It demonstrates practical frontend skills: typed React components, custom hooks to manage asynchronous side effects, a small yet expressive API abstraction, and a structured approach to UI state (filters, pagination, sorting) synchronized with the browser URL so actions are shareable and navigable.

## Features

- 🔍 **Search & Filter**: Live search plus location & status dropdown filters.
- 🧭 **URL-Synced State**: Pagination, sort, filters, and search persist in the query string (supports back/forward navigation & shareable links).
- 📑 **Pagination & Page Size**: Adjustable page size (10/25/50/100) with live range display.
- ↕️ **Sorting**: Column-level sorting with visual indicators.
- ✅ **Row Selection**: Multi-row selection support (for potential bulk actions).
- ⚙️ **Status Toggle**: Confirmed Active ↔ Inactive status updates with modal confirmation.
- 🗑️ **Delete Action**: Client-side removal (placeholder for eventual backend delete endpoint).
- 🛡️ **Typed API Client**: Centralized Axios wrapper with robust error normalization.
- ♻️ **Abortable Fetch**: Camera list requests respect component lifecycle (AbortController).
- 🎛️ **Reusable Table Component**: Generic, typed, flexible render strategies per column.
- 🧩 **Composable Hooks**: `useFetchCameras`, `useUpdateCameraStatus`, and a powerful `useQuery` for query param management.
- 🎨 **Consistent Styling**: Modular CSS and semantic class naming for maintainability.

## Tech Stack

- React 19 (with `StrictMode`)
- TypeScript (strict settings)
- Vite 7 (fast dev & optimized build)
- Axios (HTTP client)
- React Icons (iconography)
- ESLint (modern flat config) & TypeScript rules

## Architecture

The app favors a **feature-first** structure with clear separation:

- `apis/` wraps HTTP calls; no component knows request details directly.
- `hooks/` encapsulates data-fetching & URL synchronization logic.
- `components/` hosts reusable UI blocks (e.g., `Dialog`, `Table`).
- `pages/` assembles domain-specific screens (currently `CameraPage`).
- `types/` centralizes domain models & API shapes.
- `constants/` defines endpoint paths for durability and discoverability.

### Design Principles

1. **Single Responsibility**: Each hook addresses one concern (fetch, update, query state).
2. **Explicit Types**: Eliminates guesswork, promotes refactor safety.
3. **Encapsulated Side Effects**: Networking isolated from presentation layers.
4. **URL as State Source**: Enables navigation resilience and shareability.
5. **Non-Intrusive Reusability**: Table & Dialog are generic, easily portable.

## Folder Structure

```
src/
  apis/            # API client + endpoint functions
  assets/          # Static assets (logo, etc.)
  components/
    dialog/        # Reusable confirmation modal
    table/         # Generic, typed data table
  constants/       # API endpoint map
  hooks/           # Custom hooks (fetch, update, query params)
  pages/
    cameraPage/    # Cameras dashboard screen
  types/           # Domain & API TypeScript interfaces
  App.tsx          # Root component
  main.tsx         # Entry point / hydration
  index.css        # Global Reset + Typography
```

## State & Data Flow

1. `useFetchCameras` loads the camera list once, aborting safely on unmount.
2. Local component state in `CameraPage` applies derived filters (location/status) and search.
3. `useQuery` synchronizes interactive table + filter state into the URL query string.
4. Table pagination, sorting, selection operate on filtered + sorted arrays.
5. `useUpdateCameraStatus` performs optimistic status toggles; UI updates after server response.

## API Layer

`apis/client.ts` creates an Axios instance with:

- Base URL from `VITE_APP_API_BASE_URL`.
- Static bearer token (assignment demo; would be dynamic or short-lived in production).
- Unified `requestWrapper` returning `{ status, message, data }` and throwing a typed `ApiError` on failure.

Endpoints (see `constants/index.ts`):

- `GET /fetch/cameras` – Fetch all camera entities.
- `PUT /update/camera/status` – Update a camera's active/inactive status.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set environment (see below)
echo "VITE_APP_API_BASE_URL=https://api.example.com" > .env.local

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

## UI/UX Notes

- **Modal Accessibility**: Dialog traps interaction visually; future enhancement could add focus trapping + ARIA roles.
- **Sorting Indicators**: Up/down arrows clarify active direction; inactive columns show neutral glyph.
- **Status Feedback**: Pending async updates show "Please wait..." labeling.
- **Pagination**: Designed for large datasets with adjustable page size UI.
- **Health Rings**: Visual cues for device/cloud health (could evolve into radial progress components).

## Extensibility Ideas

- Integrate React Query / TanStack Query for caching & stale control.
- Add optimistic UI for delete (with undo snackbar).
- WebSocket or SSE for live camera status updates.
- Virtualized rows (React Virtual) for very large lists.
- Role-based permission gating for actions.
- Add column configuration & export (CSV/Excel).
- Central theme system (dark/light) and design tokens.

> Thanks for reviewing! 🚀
