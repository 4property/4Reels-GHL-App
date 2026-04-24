# 4Reels — Product documentation

> **What 4Reels is:** a multi-tenant SaaS that automatically generates vertical reels (3:4 / 9:16) for real-estate agencies from their listings, publishes them to the agency's social networks, and measures the traffic they drive. It's built to integrate with **GoHighLevel (GHL)** and **WordPress**, the two primary sources each agency pulls properties from.
>
> The current frontend simulates the full product experience: rendering, editing, publishing, analytics, multi-agency, and admin. MVP data is mocked (see `src/lib/api/mock/store.js`), but every screen reflects the contract the backend will have to fulfill.

---

## 1. Architecture and core concepts

### 1.1 Tenant model

A tenant = one **real-estate agency**. Each tenant has:

- A **plan** (Starter / Growth / Scale) and an associated **MRR**.
- **Seats** (team members) with roles.
- Two **data sources** that can be connected: GHL and WordPress. See `src/features/admin/agencies/AgencyDrawer.jsx`.
- Its own **music library**, **selection rules**, **brand** (logo/colors/outro), and **rendering defaults**.
- A catalog of **connected social networks** with handles.
- A **team** with per-module role permissions (see section 7).

The backend receives new properties by webhook or polling from those sources, generates reels per the tenant's defaults, and either publishes them automatically or queues them for email review — depending on the Automation configuration (section 6).

### 1.2 End-to-end reel flow

```
New property (GHL / WP)
        │
        ▼
  Ingestion (webhook/poll)  ───► Normalize photos/price/copy
        │
        ▼
  AI: photo selection + subtitle script + per-network copy
        │
        ▼
  Render (3:4/9:16 MP4 with music, intro/outro, watermark, subs)
        │
        ├── Auto-publish   ───►  Instagram / TikTok / YouTube / FB / GMB / LinkedIn
        └── Review-first   ───►  Email with "Approve / Edit / Reject"
        │
        ▼
  Link tracker (views, clicks, CTR per network, 7d/30d series)
```

---

## 2. App shell — global navigation

Implemented in `src/app/Shell.jsx` + `src/app/Topbar.jsx`.

- **Topbar** with:
  - "4Reels" brand + active agency brand (logo + name, e.g. *CKP Estate Agents*).
  - Global search (⌘K shortcut) — visual only, not wired.
  - **Theme** toggle light/dark (persisted in `localStorage` under `4r_theme`).
  - **Notifications** button (opens `NotificationSettings`, see section 8).
  - Current user's avatar.
- **Main tabs** (persisted in `localStorage` under `4r_page`):
  1. **Reels** — dashboard
  2. **Music**
  3. **Social**
  4. **Brand**
  5. **Defaults**
  6. **Automation**
  7. **Admin** (super-admin)
- Floating **Tweaks** panel activated via `postMessage` (`__activate_edit_mode`) — designed for an embedded edit mode when the app is hosted inside another shell.

---

## 3. Dashboard — reels list

Implemented in `src/features/reels/Dashboard.jsx`. It's the landing page for any operational user.

### 3.1 Monthly metrics
Four cards at the top:
- Reels this month (with delta vs. previous period).
- Published.
- Needs approval.
- Rejected.

### 3.2 Quick filters (subtabs)
- All · Needs approval · Published · Rejected, each with a count.

### 3.3 Controls
- Search by title or address.
- Advanced filters and sort (visual buttons).
- **Grid ↔ List** view toggle.

### 3.4 Reel card (Grid view)

Each card, rendered by `ReelCard`, shows:

- **3:4 preview** with the reel's `.mp4` (`src/shared/Cover.jsx`): loops with `autoPlay muted loop`.
- **StatusBadge** for publish-status (`ready`, `needs-approval`, `published`, `rejected`, `scheduled`, `failed`, `draft`).
- **Duration** top right.
- **KindBadge** (For sale / Sale agreed / Sold / To let / Let agreed / Let).
- **Circular chips** for the social networks the reel is live on.
- Title, address, price.
- **Contextual actions**:
  - If the reel is `needs-approval` → **Approve** / **Reject** buttons.
  - If `rejected` → "Not published".
  - If published → "Live on N networks".
- **Link tracker** (`TrackerStats`): if data exists, shows views, clicks, CTR (colored by threshold: <1%, 1–1.5%, >1.5%), a **7d / 30d clicks sparkline** (SVG), and a `SocialDot` for the top-performing network.

### 3.5 Table (List view)

Columns: Property (thumb + title + address), Status, Networks, Duration, Views, Clicks, CTR, Created. Clicking a row opens the `ReelEditor`.

---

## 4. Reel Editor — per-reel editing

Full-screen overlay in `src/features/reels/editor/ReelEditor.jsx`. Opens from any `ReelCard` or table row.

### 4.1 Layout

Two columns:

- **Left (preview):** 3:4 reel with the agency watermark, a dynamic *subtitle strip* showing the current scene's text, play button, **scene scrubber** (each photo is a clickable thumbnail that jumps to that scene), and a meta footer with scene count, duration, and music track.
- **Right (editor panel):** five tabs.

### 4.2 `Photos` tab

Property-photo grid with:

- **AI score** visible top right of each photo (e.g. "AI 96").
- **Selection** (click to include/exclude from the reel).
- **Drag & drop** reordering.
- "N/M" counter in the tab label.
- **Re-run AI selection** button for the model to re-pick the best photos.
- **Upload** button to add photos manually.

### 4.3 `Subtitles` tab

List of AI-generated subtitles. Each line has:

- Index, editable `start`/`end` (format `0:04`), free-text inline-editable line, delete button.
- Clicking a line navigates the preview to that scene.
- **Regenerate** (re-triggers full generation) and **Add line** buttons.
- Notice that the subtitle style comes from **Brand**.

### 4.4 `Descriptions` tab

One independent description per social network:

- Tabs per network (Instagram, TikTok, YouTube, Facebook, LinkedIn, GMB), with a green dot when enabled.
- Each network has its own **Publish to X** toggle that controls whether that description is sent on publish.
- Editable textarea with the copy (monospaced, no rich formatting).
- **Character counter** against each platform's specific limit:
  - Instagram / TikTok: 2,200
  - YouTube: 5,000
  - Facebook: 63,206
  - LinkedIn: 3,000
  - Google Business: 1,500
- Footer bar with **insertable variables** (`{{property_title}}`, `{{price}}`, etc. — see `src/lib/api/mock/store.js` → `variables`).
- Side **preview** that mocks how the post will look on the selected network (`SocialPreviewCard`, in `src/features/social/SocialPreviewCard.jsx`).
- **Reset to template** button to fall back to the template defined in the Social page.

### 4.5 `Slides` tab

Extra slides inserted into / reordered inside the reel alongside the photos:

- **Intro video** (comes from Brand by default, can be overridden per reel).
- **Outro video** (same, typically a CTA).
- **Google review** — asks for a Google review URL; the `GoogleReviewModal` simulates a fetch and returns author, rating, date, and text. The visual template of the slide is configurable (template, show author, show date).
- **Text slide** — plain text on brand colors (e.g. "New price!").
- **Photo slide** — single photo with a caption.

Each slide has: enabled toggle, duration (1–8s slider, step 0.5s), drag handle to reorder, and delete. "From defaults" chip if it came from the global Brand.

### 4.6 `Voiceover` tab

Two mutually-exclusive modes picked from the top switch:

#### `Record` mode
A "recording console" with:
- Input meter (22 bars green→yellow→red) and mic selector.
- Large **rec** button with 3-2-1 countdown, pulsing REC indicator, `m:ss` timer.
- Side options:
  - *Play reel while recording* (teleprompter with subtitles).
  - *Mute music during takes* (avoids bleed).
  - *Mic armed* (spacebar to start/stop).
- **Takes list** with waveform, play, inline rename, download, delete, and an "Active" badge on the take that will be used at publish time.

#### `AI voice` mode
- AI voice picker (6 voices: Emma IE, Conor IE, Ava UK, Noah US, Sofía ES, Mateo ES — each with gender/accent/tone and a Preview button).
- Script textarea (auto-populated from the subtitles).
- Buttons: **Copy from subtitles**, **Rewrite with AI**, **Preview voice**, **Generate voiceover**.
- Duration estimate at normal pace.

#### Mix (shared across both modes)
Three 0–100% sliders:
- Voice volume
- Music volume
- Music ducking — how much music drops while voice is speaking.

### 4.7 Editor header

Global actions: **Regenerate with AI**, **Export**, **Publish** (primary).

---

## 5. Tenant-wide configuration

### 5.1 Music — `src/features/music/`

Two sub-tabs.

#### 5.1.1 Library
Track table with:
- Inline play (only one track plays at a time).
- Title + artist.
- **Waveform** rendered from the track's `waveform` array.
- BPM, duration.
- **Mood tags** (warm, energetic, cinematic, luxurious, modern, minimal, acoustic, relaxed).
- **Property types** the track can be used for (luxury, family, rental).
- **Favorite star** — only favorited tracks enter the random-selection pool. Favoriting moves the track to the top.
- Filters: All / Favorites / by mood / search.
- MP3 upload via drop/upload. **Explicit warning** about copyright.

#### 5.1.2 Selection rules
Two blocks that decide which tracks the AI can pick for each reel:
- **By property type** (Luxury / Family / Rental): list of eligible favorites.
- **By status** (For sale, Sale agreed, Sold, To let, Let agreed, Let) — match the *tone* to the moment (e.g. celebratory for "Sold", calm for "For sale").
- **Fallback toggle**: if no rule matches, fall back to the full favorites pool instead of failing the render.

### 5.2 Social — `src/features/social/`

Page to:
- See which networks are connected (chips with real handles).
- **Edit the description template** per network. Each network starts with a default template with its own tone — Instagram/Facebook with more emoji, LinkedIn more formal, GMB a single flat line.
- Templates use `{{variables}}` inserted on click from the tag-chip bar (catalog of variables: `property_title`, `city`, `neighborhood`, `neighborhood_tag`, `price`, `bedrooms`, `bathrooms`, `size_m2`, `short_description`, `booking_link`, `agent_name`, `agent_phone`).
- **Highlighted rendering**: `{{tags}}` are drawn as pills inside the text for readability.
- **Side preview** per network with `SocialPreviewCard` — replaces variables with real sample data and shows how the post will look.
- Per-network character limit applied (same mapping as the editor).

### 5.3 Brand — `src/features/brand/BrandConfig.jsx`

Defines the look of *every* reel in this agency:

- **Identity**: logo (PNG recommended 512×512), agency name (tagline), primary color, secondary color (color pickers), heading font (Inter / Söhne / Manrope / Plus Jakarta Sans / Helvetica).
- **Watermark**: on/off toggle, position (4 corners), opacity 30–100.
- **Outro card**: toggle, headline + sub-line. Shows in the last ~2s of the reel.
- **Live 3:4 preview** on the right showing watermark + subtitle strip + outro reacting to changes in real time.

### 5.4 Defaults — `src/features/defaults/`

"Reel defaults / Customization". Six sub-tabs in a left sidebar, panel on the right. Everything set here is applied to every new reel but can be overridden from the editor.

#### 5.4.1 Format & locale
- Currency (EUR / USD / GBP / CAD / AUD) + symbol position (prefix/suffix).
- Thousands and decimal separators.
- Price rounding: Exact / Nearest 1K / Nearest 10K.
- Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD MMM YYYY, MMM DD YYYY).
- Time format 24h/12h.
- Timezone.
- UI language (en-IE, en-GB, en-US, es-ES).
- Metric vs. imperial unit system (m² / km vs ft² / mi).

#### 5.4.2 Subtitles (style)
- Typography: font, weight (500/600/700/800), size (28–72 px).
- Text color, uppercase on/off, max chars per line, alignment.
- Background: None / Pill / Block / Outline, color, opacity.
- Vertical position (top/middle/bottom).
- **Karaoke word-highlight**: toggle + color — the active word is highlighted as it's spoken.

#### 5.4.3 Video & timing
- **Aspect ratio**: 9:16, 3:4, 1:1, 4:5.
- Resolution: 720p / 1080p / 1440p / 4K.
- FPS: 24 / 30 / 60.
- **Duration strategy**: Auto (by photo count) or fixed range with min/max sliders.
- **Transitions** between scenes: Hard cut / Crossfade / Slide / Zoom.
- Ken Burns toggle (gentle pan & zoom per photo).
- Intro / Outro card toggles.

#### 5.4.4 Intro & outro (video pieces)
- **Intro** and **Outro** share the same structure: enabled toggle, source (uploaded / brand-card / none), duration, file with name/size/duration.
- **Rules**: Skip on rentals, skip when reel is shorter than 15s, allow agents to disable per reel.

#### 5.4.5 Audio
- Music volume (0–100).
- Fade in / fade out toggles.
- Duck on voice (lower music when VO is present).
- Voiceover on by default.

#### 5.4.6 Caption generation
- Subtitle language.
- Case (sentence / title / upper).
- Include emoji in subtitles (on/off).

---

## 6. Automation — `src/features/automation/`

**The key product decision** lives here. Two mutually-exclusive modes rendered as large cards:

### 6.1 `Publish automatically` mode
Hands-off: as soon as the reel finishes rendering, it's published. Designed for agencies with high listing volume.

Configurable details:
- **Hold window** — hold the reel N hours (30 min, 1h, 2h, 4h, 8h, 24h, or custom) before posting as a cancellation/edit safety net from the dashboard.
- **Quiet hours** (22:00 → 07:00) — reels finishing at night post at 07:00.
- **Skip weekends** — anything finishing Saturday/Sunday waits for Monday.
- **Default networks** — chips per network; disabled if the network isn't connected.

### 6.2 `Send email before publishing` (review-first) mode
Every reel lands in *Needs review* and an email goes to the recipient list with 1-click buttons **Approve & publish**, **Open editor**, **Reject**.

Details:
- CSV list of recipient emails.
- **Preview** of the approval email — shows exactly what the recipient sees.
- Quiet hours also apply to email sending.

### 6.3 Rendering defaults (shared across both modes)
- Auto-generate subtitles.
- Re-render when property data changes upstream (if GHL/WP update price or photos, regenerate the reel).

---

## 7. Admin (super-admin) — `src/features/admin/`

View for the platform operator (*you*, not each agency's agents).

### 7.1 Platform metrics
- Active tenants.
- Total MRR.
- Reels rendered (30d).
- % of failed renders.

### 7.2 `Agencies` table
All tenants with: name + id, plan, seats, reels/30d, **status of both sources** (GHL / WP as green/red/yellow pills), MRR, status (active / trial / paused), joined.

Click a row → **AgencyDrawer** side panel.

### 7.3 AgencyDrawer

Right-side drawer, 680 px wide, with three tabs:

#### Sources
The two listing sources the backend reads to generate reels. Credentials are **visible only to the super-admin**.

- **GoHighLevel card**:
  - Location ID (e.g. `loc_ABCD1234`).
  - API token (*private integration token*, `pit-…` style, with show/hide toggle).
  - **Test connection** button — validates that the token + location ID are valid, updates `status` and `lastSync`.
  - Inline error if the connection fails (e.g. "401 Unauthorized — API key expired 3 days ago").
  - Hint for where the key is created in GHL: `Settings → Integrations → Private Integrations → Create new`.
- **WordPress card**:
  - URL (HTTPS required).
  - Reads listings from `/wp-json/wp/v2/`.
  - *Application Password* hidden with a toggle.
  - Polling interval (default 5 min).
  - Simulated test connection.
  - Typical error messages: "REST API returning 403 — Application Password rejected".

#### Billing
Plan, MRR, seats, joined, next invoice, payment method. **Open in Stripe** and **Change plan** buttons.

#### Activity
Recent event log: publishes, syncs, plan changes, seat additions, etc.

### 7.4 Invite agency
Modal from the header ("+ Invite agency") to add a new tenant: name, admin name, admin email, *Send magic-link invitation now* toggle. Its sources are configured afterwards in the drawer.

### 7.5 Team & permissions — `src/features/admin/team/`

> Note: this panel is implemented but not yet wired into `AdminView`. It's the per-agency team management module (not super-admin) and will mount when sub-navigation is added to Admin.

- **Security policy** (applies to every workspace member):
  - Require 2FA (blocks login until each member enables 2FA; warns how many haven't).
  - SSO on/off + provider (Google Workspace / Microsoft 365 · Azure AD / Okta SAML / Custom SAML) + allowed domain.
  - Session timeout (1h / 4h / 8h / 24h / 7d).
  - Default role for SSO users.
- **Role filters** (All / Admin / Editor / Viewer) with counters, + "pending invites", + access to the **View role permissions** modal.
- **Members table**: avatar, email, role (inline editable), 2FA enabled/off, SSO linked/—, status (active/invited/suspended), last active.
- **Multi-select** with bulk actions: change role, remove.
- **Invite members modal** — adds emails with roles.
- **Edit user modal** — change role, show role description.
- **Role permissions modal** — matrix of permissions by module × role (reels / publish / music / brand / automation / admin / api) with values `rw` / `ro` / `none`. Three fixed roles: **Admin** (rw across everything), **Editor** (rw on reels/publish/music/brand, ro on automation, none on admin/api), **Viewer** (ro on almost everything, none on publish/admin/api).

---

## 8. Notification Settings

Modal in `src/features/notifications/NotificationSettings.jsx`. Accessed from the bell icon in the topbar.

- **Channels**: Email / Slack (`#listings`) / SMS (urgent failures only). Per-channel toggle.
- **Recipients**: list of recipients. Each with email, name, role, and *which events they want to receive*:
  - Needs approval
  - Published
  - Failed render
- Add a new email (Enter or Add button).
- Remove a recipient.
- **Delivery frequency**: Instant / Hourly digest / Daily digest (09:00).

---

## 9. Data model (mock)

Defined in `src/lib/api/mock/store.js`. Feature hooks surface it through the API client.

| Entity | Key fields |
|---|---|
| `agency` | `name`, `tenantId`, `plan`, `logo`, `color` |
| `socials[]` | `id`, `name`, `icon`, `color`, `connected`, `handle` (Instagram, TikTok, YouTube, Facebook, LinkedIn, Google Business) |
| `reels[]` | `id`, `title`, `address`, `price`, `status`, `publishStatus`, `cover`, `createdAt`, `duration`, `scenes`, `music`, `kind` (for-sale/sale-agreed/sold/to-let/let-agreed/let), `type` (luxury/family/rental), `networks[]`, `tracker: { views, clicks, ctr, topNet, clicks7d[], clicks30d[] }` |
| `tracks[]` | `id`, `title`, `artist`, `bpm`, `duration`, `mood[]`, `propertyTypes[]`, `statuses[]`, `favorite`, `waveform[]` |
| `variables[]` | catalog of `{{tag}}` placeholders |
| `tenants[]` | agencies registered on the platform (super-admin) |
| `team[]` | members of the active tenant with role, 2FA, SSO, lastSeen |
| `roles[]` | Admin / Editor / Viewer with a per-module permission matrix |

---

## 10. Link tracking (analytics)

Every publish 4Reels performs carries a **short link** of its own. Metrics the backend returns and the frontend already visualizes:

- `views` — reel impressions.
- `clicks` — short-link clicks (CTAs, booking_link).
- `ctr` — percentage, traffic-light on the Dashboard: >1.5% green, 1–1.5% yellow, <1% gray.
- `topNet` — the network driving the most clicks.
- `clicks7d[]` and `clicks30d[]` — daily series rendered by the dashboard sparkline.

The `TrackerStats` card is embedded in every `ReelCard` and lets you toggle between 7d / 30d without leaving the dashboard.

---

## 11. Theming, technical branding, and assets

- Theming via CSS variables. Light/dark toggle sets `data-theme` on `<html>`. Persisted in `localStorage`.
- **Inter** and **JetBrains Mono** fonts packaged locally (via `@fontsource`, no CDN).
- Custom stroke-based iconography (Lucide-inspired) in `src/shared/Icon.jsx`. ~70 icons.
- **Static assets** under `public/assets/` (CK logo, real photos of the Cranford Court apartment used as samples, `reel.mp4` shown in every preview) and `public/uploads/`.

---

## 12. Platform integrations (what the backend must fulfill)

Summary of the contracts the frontend *expects*:

### 12.1 Ingestion
- **GoHighLevel**: read *opportunities/contacts/custom fields* via Private Integration Token + Location ID. Fields consumed include price, photos, description, pipeline stage (e.g. "Listed").
- **WordPress**: read a configurable Custom Post Type (default `property`) via REST (`/wp-json/wp/v2/<cpt>`), authenticated with an Application Password. Polling every N minutes.

### 12.2 Rendering
- Input: selected photos (+ AI scores) + subtitles + chosen music + brand + defaults.
- Output: 3:4 MP4 (or the configured aspect ratio) with burned-in subtitles, intro/outro, watermark, music, optional voiceover (mixed with ducking).

### 12.3 Publishing
- Native APIs for Instagram (Reels), TikTok, YouTube (Shorts), Facebook (Reels), LinkedIn, Google Business Profile.
- One short link per publish that redirects to the `booking_link` and logs views/clicks.

### 12.4 Approvals
- Transactional emails with signed 1-click URLs: `approve`, `reject`, `open editor`.

### 12.5 Outgoing webhooks (future)
- `reel.published`, `reel.failed`, `reel.needs_approval` events — consumable from GHL for downstream workflows.

---

## 13. Code structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full layer-by-layer breakdown. Short version:

```
src/
├── main.jsx, App.jsx              entry + providers
├── app/                           shell, topbar, tab router, providers, postMessage protocol
├── lib/                           api client + mock + generic hooks + utils
├── shared/                        UI primitives (Icon, Cover, Toggle, …)
├── features/                      one folder per product domain (reels, music, social, …)
└── styles/                        vanilla CSS split by responsibility
```

The project runs on **Vite + React 18** (see `package.json`). Dependencies (React, ReactDOM, fonts) are served from `node_modules`, no CDN.

---

## 14. What's **not** there yet in the frontend

To keep scope honest, these aren't wired up (but the real product will need them):

- Real backend — everything is mocked; no button persists to an actual API.
- Real auth (login / logout / password reset) — the app assumes the user is already signed in.
- Tenant-facing billing panel (the super-admin does see one from the drawer).
- Render error logs for the agent (the super-admin has them in Activity).
- **Team** panel inside the tenant's Admin view — the `AdminTeam` component exists but isn't wired into navigation.
- Initial onboarding (first-time agency setup screens).
- Consistent contextual help/tooltips.

---

## 15. Quick glossary

- **Reel** — vertical video generated from a listing.
- **Scene / slide** — unit inside the reel; can be a photo with Ken Burns, an intro/outro, a text slide, or a Google review.
- **Tenant / agency** — 4Reels customer.
- **Source** — listing origin (GHL or WP).
- **Publish mode** — auto vs review-first.
- **Favorite track** — music track eligible for automatic selection.
- **Hold window** — cancellation/editing grace period after render and before posting.
- **Ducking** — lowering music when voice is speaking.
- **Karaoke highlight** — current word highlighted in subtitles.
- **Short link tracker** — signed link that measures views/clicks per network.
