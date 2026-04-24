# 4Reels — Frontend architecture

> Stack: **React 18 + Vite + @fontsource** (only for local fonts). No React Query, no MSW, no TypeScript. Vanilla CSS split into focused files. JSDoc for typing with zero build-time overhead.

## Guiding principles

- **Feature-based layout.** Each product domain owns a self-contained folder under `src/features/<name>/` with its own endpoints, hooks, and components. Adding a new feature means adding one folder; nothing else moves.
- **Explicit data layer.** Every HTTP request goes through `src/lib/api/client.js`. No component calls `fetch` directly. When `VITE_USE_MOCK=true` the client routes to an in-memory mock; when it's `false`, it hits `VITE_API_URL`. Switching to the real backend is a single env change.
- **Minimal providers.** Only `ThemeProvider` (light/dark) and `TenantProvider` (current agency, socials, variables). Everything else is either local `useState` or a feature-scoped hook.

## File tree

```
src/
├── main.jsx                       # entry: root render + fonts + CSS
├── App.jsx                        # providers + <Shell/>
│
├── app/                           # application shell, navigation, providers
│   ├── Shell.jsx                  # topbar + tab router + global modals
│   ├── Topbar.jsx
│   ├── TweaksPanel.jsx            # floating panel for embedded edit-mode
│   ├── pages.js                   # list of tabs (Reels/Music/…)
│   ├── useEmbeddedEditMode.js     # parent-frame postMessage protocol
│   └── providers/
│       ├── ThemeProvider.jsx      # useTheme()
│       └── TenantProvider.jsx     # useAgency, useSocials, useVariables, useSocial(id)
│
├── lib/                           # non-product infrastructure, reusable
│   ├── api/
│   │   ├── client.js              # fetch wrapper (auth, errors, mock switch)
│   │   ├── ApiError.js            # typed error class
│   │   └── mock/                  # in-memory mock backend
│   │       ├── index.js           # dispatcher
│   │       ├── store.js           # fixtures (reels, tracks, tenants, team…)
│   │       └── handlers/          # one file per domain
│   │           ├── reels.js
│   │           ├── music.js
│   │           ├── social.js
│   │           ├── tenant.js
│   │           └── admin.js
│   ├── hooks/
│   │   ├── useApi.js              # { data, loading, error, refetch } + useMutation
│   │   └── useLocalStorage.js
│   └── utils/
│       ├── format.js              # fmtNum, initials, ctrColor
│       └── template.js            # renderTemplate, splitTemplate for {{vars}}
│
├── shared/                        # UI primitives — no data dependencies
│   ├── Icon.jsx                   # ~70 inline SVG icons
│   ├── Cover.jsx                  # 3:4 preview (video/image/placeholder)
│   ├── Avatar.jsx
│   ├── Toggle.jsx
│   ├── Checkbox.jsx
│   ├── Segmented.jsx
│   ├── StatusBadge.jsx
│   ├── KindBadge.jsx
│   ├── SocialDot.jsx              # social-network chip (takes `net` as prop)
│   ├── ColorInput.jsx
│   ├── EmptyBox.jsx
│   └── Spinner.jsx
│
├── features/                      # product domains
│   ├── reels/
│   │   ├── api.js                 # GET /reels, PATCH /reels/:id, POST approve/reject
│   │   ├── hooks.js               # useReels, useReel, useUpdateReel, useApproveReel…
│   │   ├── index.js               # public exports: Dashboard, ReelEditor
│   │   ├── Dashboard.jsx
│   │   ├── ReelCard.jsx           # grid view
│   │   ├── ReelsTable.jsx         # list view
│   │   ├── TrackerStats.jsx
│   │   ├── Sparkline.jsx
│   │   ├── CompactStat.jsx
│   │   └── editor/                # full editor subtree
│   │       ├── ReelEditor.jsx     # orchestrator
│   │       ├── PhotosPanel.jsx
│   │       ├── SubtitlesPanel.jsx
│   │       ├── DescriptionsPanel.jsx
│   │       ├── SlidesPanel.jsx
│   │       ├── SlideRow.jsx
│   │       ├── GoogleReviewModal.jsx
│   │       ├── VoiceoverPanel.jsx
│   │       ├── VoiceoverRecorder.jsx
│   │       ├── VoiceoverAI.jsx
│   │       ├── TakeRow.jsx
│   │       ├── Slider.jsx
│   │       ├── aiVoices.js        # AI-voice catalog
│   │       └── defaults.js        # seed data (photos, subtitles, slides)
│   │
│   ├── music/
│   │   ├── api.js, hooks.js, index.js
│   │   ├── MusicConfig.jsx
│   │   ├── MusicLibrary.jsx
│   │   ├── MusicRules.jsx
│   │   └── Waveform.jsx
│   │
│   ├── social/
│   │   ├── api.js, hooks.js, index.js, styles.css
│   │   ├── SocialConfig.jsx
│   │   └── SocialPreviewCard.jsx  # also used by reels/editor/DescriptionsPanel
│   │
│   ├── brand/
│   │   ├── BrandConfig.jsx        (+ index.js)
│   │
│   ├── defaults/
│   │   ├── ReelDefaultsConfig.jsx # shell with 6 sub-tabs
│   │   ├── LivePreview.jsx
│   │   ├── IntroOutroCard.jsx     # reused for Intro + Outro
│   │   ├── initialState.js        # defaults seed
│   │   ├── formatter.js           # price/date sample previews
│   │   └── tabs/
│   │       ├── FormatTab.jsx
│   │       ├── SubtitlesTab.jsx
│   │       ├── VideoTab.jsx
│   │       ├── IntroOutroTab.jsx
│   │       ├── AudioTab.jsx
│   │       └── CaptionsTab.jsx
│   │
│   ├── automation/
│   │   ├── AutomationConfig.jsx   # shell + ModePicker
│   │   ├── ModeCard.jsx
│   │   ├── AutoPublishDetails.jsx
│   │   └── ReviewModeDetails.jsx  (+ index.js)
│   │
│   ├── admin/
│   │   ├── api.js, hooks.js, index.js
│   │   ├── AdminView.jsx          # super-admin (agencies)
│   │   ├── agencies/
│   │   │   ├── AgenciesTable.jsx
│   │   │   ├── AgencyDrawer.jsx
│   │   │   ├── GHLSourceCard.jsx
│   │   │   ├── WPSourceCard.jsx
│   │   │   ├── BillingTab.jsx
│   │   │   ├── ActivityTab.jsx
│   │   │   ├── InviteAgencyModal.jsx
│   │   │   └── logos.jsx          # inline GHL/WP SVGs
│   │   └── team/                  # (not yet wired into the shell; ready to plug in)
│   │       ├── AdminTeam.jsx      # shell
│   │       ├── PolicyStrip.jsx
│   │       ├── TeamTable.jsx
│   │       ├── UserRowActions.jsx
│   │       ├── InviteMembersModal.jsx
│   │       ├── EditUserModal.jsx
│   │       └── RolePermissionsModal.jsx
│   │
│   └── notifications/
│       ├── NotificationSettings.jsx  (+ index.js)
│
└── styles/                        # vanilla CSS, one file per responsibility
    ├── index.css                  # barrel (imports the rest)
    ├── tokens.css                 # CSS variables + dark theme
    ├── reset.css
    ├── layout.css                 # topbar, tabs, page, subtabs
    ├── buttons.css
    ├── forms.css                  # input, textarea, select, toggle, search, seg
    ├── surfaces.css               # card, tbl, badge, avatar, empty
    └── utilities.css              # row, stack, mono, sep, scrollbar, keyframes
```

## Data flow

```
Component
   │  calls a feature hook
   ▼
features/<domain>/hooks.js
   │  calls the feature's api function
   ▼
features/<domain>/api.js
   │  apiRequest('/path', { method, body, query })
   ▼
lib/api/client.js
   │
   ├── if VITE_USE_MOCK=true → lib/api/mock/index.js → handler at /handlers/<domain>.js → store.js
   └── if VITE_USE_MOCK=false → fetch(VITE_API_URL + path, …)
```

A component **never** calls `fetch` or imports `apiRequest` directly. It always goes through a feature hook. That isolation is what lets us swap the backend, tweak headers, or add caching without touching any component.

## Connecting to the real backend

1. Create `.env.local` (copy `.env.example`) with:
   ```
   VITE_USE_MOCK=false
   VITE_API_URL=https://api.yourdomain.com
   ```
2. If your backend uses a different path prefix (`/v1`, etc.), adjust the URLs in each `features/*/api.js`.
3. If the backend requires auth or a tenant header, edit `getAuthHeaders()` in a single place: [src/lib/api/client.js](src/lib/api/client.js).

That's it. No components change.

## Adding a new feature

Example: "Reports".

1. `src/features/reports/api.js` — define `reportsApi.list()`, `.get(id)`, etc.
2. `src/features/reports/hooks.js` — expose `useReports()`, `useReport(id)` using `useApi`.
3. `src/features/reports/ReportsPage.jsx` — consume the hooks.
4. `src/features/reports/index.js` — `export { ReportsPage }`.
5. Add the mock at `src/lib/api/mock/handlers/reports.js` and register it in `src/lib/api/mock/index.js`.
6. Add the tab to [src/app/pages.js](src/app/pages.js) and wire the mapping in [src/app/Shell.jsx](src/app/Shell.jsx).

Nothing else to touch.

## Layer rules

- `shared/` doesn't import from `features/` or `app/`. It's pure presentation and takes everything via props.
- `features/<x>/` may import from `shared/`, `lib/`, and `app/providers/`. It can import from another feature only when there's a clear reason (e.g. `features/reels/editor/DescriptionsPanel` uses `features/social/SocialPreviewCard`).
- `app/` orchestrates providers + shell. It contains no domain logic.
- `lib/` doesn't import from any other layer (it's the base).

## State management

- **Server state** (lists, details): always via `useApi` + `apiRequest`. Each hook returns `{ data, loading, error, refetch }`. For writes, use `useMutation`.
- **Global UI state** (theme, current tenant): Context under `app/providers/`.
- **Local UI state** (tabs, modals, forms): `useState` inside the component.
- **Lightweight persistence** (current tab, theme): `useLocalStorage`.

## Styling

- Vanilla CSS, no preprocessor.
- One file per responsibility under `src/styles/`.
- All reusable classes (`.btn`, `.card`, `.input`, `.toggle`, etc.) live in `src/styles/*.css`.
- Styles very specific to a single feature go in `src/features/<x>/styles.css` and are imported from the component (see `features/social/styles.css`).

## Mock as the backend spec

The mock isn't throwaway scaffolding. It's the living spec of the backend contract:

- `store.js` defines the exact shape of every entity.
- `handlers/<domain>.js` enumerates every endpoint by method and path.

Before turning the mock off, the backend needs to implement the same paths with the same shapes.
