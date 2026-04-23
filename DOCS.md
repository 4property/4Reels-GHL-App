# 4Reels — Documentación funcional del producto

> **Qué es 4Reels:** un SaaS multi-tenant que genera automáticamente reels verticales (3:4 / 9:16) para inmobiliarias a partir de sus listados, los publica en las redes sociales del cliente y mide el tráfico que generan. Está pensado para integrarse con **GoHighLevel (GHL)** y **WordPress**, que son las dos fuentes principales de donde cada agencia saca sus propiedades.
>
> El frontend actual simula la experiencia completa del producto: renderizado, edición, publicación, métricas, multi-agencia y administración. Los datos del MVP son mock (ver [data/mock.js](data/mock.js)), pero cada pantalla refleja el contrato real que el backend tendrá que cumplir.

---

## 1. Arquitectura y conceptos base

### 1.1 Modelo de tenants

Un tenant = una **agencia inmobiliaria**. Cada tenant tiene:

- Un **plan** (Starter / Growth / Scale) y un **MRR** asociado.
- **Seats** (miembros del equipo) con roles.
- Dos **fuentes de datos** conectables: GHL y WordPress. Ver [components/AgencyDrawer.jsx](components/AgencyDrawer.jsx).
- Su propia **biblioteca de música**, **reglas de selección**, **marca** (logo/colores/outro) y **defaults de render**.
- Un catálogo de **redes sociales conectadas** con handles.
- Un **equipo** con permisos por rol (ver sección 7).

El backend recibirá las propiedades nuevas por webhook/poll desde esas fuentes, generará reels según los defaults del tenant, y o bien los publicará automáticamente o los enviará a revisión por email — dependiendo de su configuración de Automation (sección 6).

### 1.2 Flujo end-to-end de un reel

```
Propiedad nueva (GHL / WP)
        │
        ▼
  Ingesta (webhook/poll)  ───► Normalización de fotos/precio/texto
        │
        ▼
  AI: selección de fotos + guion de subtítulos + copy por red
        │
        ▼
  Render (MP4 3:4/9:16 con música, intro/outro, watermark, subs)
        │
        ├── Auto-publish  ───►  Instagram / TikTok / YouTube / FB / GMB / LinkedIn
        └── Review-first  ───►  Email con "Approve / Edit / Reject"
        │
        ▼
  Link tracker (views, clicks, CTR por red, series 7d/30d)
```

---

## 2. Shell de la app — navegación global

Implementado en [components/App.jsx](components/App.jsx).

- **Topbar** con:
  - Marca "4Reels" + marca de la agencia activa (logo + nombre, ej. *CKP Estate Agents*).
  - Buscador global (atajo `⌘K`) — solo visual, no wireado.
  - Toggle de **tema** claro/oscuro (persistido en `localStorage` con la clave `4r_theme`).
  - Botón de **notificaciones** (abre el modal `NotificationSettings`, ver sección 8).
  - Avatar del usuario activo.
- **Tabs principales** (pestañas persistidas en `localStorage` con la clave `4r_page`):
  1. **Reels** — dashboard
  2. **Music**
  3. **Social**
  4. **Brand**
  5. **Defaults**
  6. **Automation**
  7. **Admin** (super-admin)
- Panel flotante **Tweaks** que se activa mediante `postMessage` (`__activate_edit_mode`) — está pensado para un modo edición embebido en un parent frame (ej. cuando la app se embebe en otro shell).

---

## 3. Dashboard — listado de reels

Implementado en [components/Dashboard.jsx](components/Dashboard.jsx). Es la landing de todo usuario operativo.

### 3.1 Métricas del mes
Cuatro tarjetas en la parte superior:
- Reels este mes (con delta vs. periodo anterior).
- Publicados.
- Pendientes de aprobar (*Needs approval*).
- Rechazados.

### 3.2 Filtros rápidos (subtabs)
- All · Needs approval · Published · Rejected, con contador en cada filtro.

### 3.3 Controles
- Búsqueda por título o dirección.
- Filtros avanzados y ordenación (botones visuales).
- Toggle de vista **Grid ↔ List**.

### 3.4 Tarjeta de reel (vista Grid)

Cada card, renderizada por `ReelCard`, muestra:

- **Preview 3:4** con el `.mp4` del reel (componente [components/Cover.jsx](components/Cover.jsx)): reproduce en bucle con `autoPlay muted loop`.
- **StatusBadge** de publish-status (`ready`, `needs-approval`, `published`, `rejected`, `scheduled`, `failed`, `draft`).
- **Duración** arriba a la derecha.
- **KindBadge** (For sale / Sale agreed / Sold / To let / Let agreed / Let).
- **Chips circulares** de las redes sociales en las que está publicado.
- Título, dirección, precio.
- **Acciones contextuales**:
  - Si el reel está en `needs-approval` → botones **Approve** / **Reject**.
  - Si está `rejected` → "Not published".
  - Si está publicado → "Live on N networks".
- **Tracker de links** (`TrackerStats`): si hay datos, muestra views, clicks, CTR (con color según rango <1%, 1–1.5%, >1.5%) y un **sparkline SVG** con toggle 7d / 30d de clicks, más un `SocialDot` de la red con más clicks.

### 3.5 Tabla (vista List)

Tabla con: Property (thumb + título + dirección), Status, Networks, Duration, Views, Clicks, CTR, Created. Cada fila abre el `ReelEditor` al hacer click.

---

## 4. Reel Editor — edición individual

Overlay a pantalla completa, en [components/ReelEditor.jsx](components/ReelEditor.jsx). Se abre desde cualquier ReelCard o fila de la tabla.

### 4.1 Layout

Dos columnas:

- **Izquierda (preview):** reel 3:4 con watermark de la agencia, *subtitle strip* dinámica mostrando el texto de la escena actual, botón play, **scrubber por escenas** (cada foto es una miniatura clickeable que salta a esa escena) y meta inferior con número de escenas, duración y track de música.
- **Derecha (panel de edición):** cinco tabs.

### 4.2 Tab `Photos`

Grid de fotos de la propiedad con:

- **Score de AI** visible arriba a la derecha de cada foto (ej. "AI 96").
- **Selección** (click = incluir/excluir del reel).
- **Drag & drop** para reordenar.
- Contador "N/M" en el tab.
- Botón **Re-run AI selection** para que el modelo vuelva a sugerir las mejores.
- Botón **Upload** para añadir fotos manualmente.

### 4.3 Tab `Subtitles`

Lista de subtítulos generados por la AI. Cada línea tiene:

- Índice, `start`/`end` editables (formato `0:04`), texto libre editable inline, botón de borrar.
- Click sobre una línea navega el preview a esa escena.
- Botones **Regenerate** (relanza la generación completa) y **Add line**.
- Aviso de que el estilo del subtítulo viene de **Brand**.

### 4.4 Tab `Descriptions`

Una descripción independiente por red social:

- Tabs por red (Instagram, TikTok, YouTube, Facebook, LinkedIn, GMB), con dot verde si está habilitada.
- Cada red tiene su propio toggle **Publish to X**, que determina si esa descripción saldrá al publicar.
- Textarea con el copy editable (mono-espaciado, sin formato rich).
- **Contador de caracteres** contra el límite específico de cada plataforma:
  - Instagram / TikTok: 2,200
  - YouTube: 5,000
  - Facebook: 63,206
  - LinkedIn: 3,000
  - Google Business: 1,500
- Barra inferior con **variables insertables** (`{{property_title}}`, `{{price}}`, etc. — ver [data/mock.js](data/mock.js) `variables`).
- **Preview** en el lateral: tarjeta que simula cómo se verá ese post en la red seleccionada (`SocialPreviewCard`, en [components/SocialConfig.jsx](components/SocialConfig.jsx)).
- Botón **Reset to template** para volver a la plantilla de la sección Social.

### 4.5 Tab `Slides`

Slides extra que se pueden insertar/reordenar en el reel además de las fotos:

- **Intro video** (por defecto viene del Brand, se puede override por reel).
- **Outro video** (idem, típicamente un CTA).
- **Google review** — pide la URL de una reseña de Google; el modal `GoogleReviewModal` simula el *fetch* y devuelve autor, rating, fecha y texto. La plantilla visual de la slide es configurable (template, mostrar autor, mostrar fecha).
- **Text slide** — texto plano sobre los colores de marca (ej. "New price!").
- **Photo slide** — una única foto con caption.

Cada slide tiene: toggle enabled, duración (slider 1–8s con step 0.5s), drag handle para reordenar y borrar. Chip "From defaults" si viene del Brand global.

### 4.6 Tab `Voiceover`

Dos modos excluyentes seleccionables en el switch superior:

#### Modo `Record`
Una "consola de grabación" con:
- Meter de input (22 barras verde→amarillo→rojo) y selector de micro.
- Botón **rec** grande con countdown 3-2-1, indicador REC pulsante, timer `m:ss`.
- Opciones laterales:
  - *Play reel while recording* (teleprompter con subtítulos).
  - *Mute music during takes* (evita bleed).
  - *Mic armed* (spacebar para start/stop).
- **Lista de takes** con waveform, play, rename inline, descargar, borrar, y badge "Active" en el take que se usará al publicar.

#### Modo `AI voice`
- Selector de voz AI (6 voces: Emma IE, Liam IE, Niamh UK, Seán US, Carmen ES, Hugo ES — con gender/accent/tone y botón Preview).
- Textarea con el guion (auto-poblado desde los subtítulos).
- Botones **Copy from subtitles**, **Rewrite with AI**, **Preview voice**, **Generate voiceover**.
- Estimación de duración según velocidad normal.

#### Mix (común a ambos modos)
Tres sliders 0–100%:
- Voice volume
- Music volume
- Music ducking — cuánto baja la música cuando hay voz.

### 4.7 Header del editor

Acciones globales: **Regenerate with AI**, **Export**, **Publish** (primario).

---

## 5. Configuraciones globales del tenant

### 5.1 Music — [components/MusicConfig.jsx](components/MusicConfig.jsx)

Dos sub-tabs.

#### 5.1.1 Library
Tabla de tracks con:
- Play inline (solo un track sonando a la vez).
- Título + artista.
- **Waveform** renderizada a partir del array `waveform` del track.
- BPM, duración.
- **Mood tags** (warm, energetic, cinematic, luxurious, modern, minimal, acoustic, relaxed).
- **Property types** en los que se puede usar (luxury, family, rental).
- **Favorite star** — solo los tracks marcados como favoritos entran en el pool de selección aleatoria. Favoritar mueve el track al tope de la lista.
- Filtros: All / Favorites / por mood / búsqueda.
- Subida de MP3 por drop/upload. **Aviso explícito** de no subir copyright.

#### 5.1.2 Selection rules
Dos bloques que determinan qué tracks puede elegir la AI para cada reel:
- **Por tipo de propiedad** (Luxury / Family / Rental): lista de los favorites elegibles.
- **Por estado** (For sale, Sale agreed, Sold, To let, Let agreed, Let) — match del *tono* al momento (ej. celebratorio para "Sold", tranquilo para "For sale").
- **Fallback toggle**: si ninguna regla matchea, caer al pool completo de favorites en lugar de fallar el render.

### 5.2 Social — [components/SocialConfig.jsx](components/SocialConfig.jsx)

Página para:
- Ver qué redes están conectadas (chips con handle real).
- **Editar la plantilla de descripción** por red. Cada red arranca con un template por defecto (distinto tono según la plataforma — Instagram/Facebook más emojis, LinkedIn más formal, GMB una línea plana).
- Las plantillas usan `{{variables}}` insertadas a golpe de click desde la barra de "tag chips" (con las variables del catálogo: `property_title`, `city`, `neighborhood`, `neighborhood_tag`, `price`, `bedrooms`, `bathrooms`, `size_m2`, `short_description`, `booking_link`, `agent_name`, `agent_phone`).
- **Render highlighted**: los `{{tags}}` se pintan como pills dentro del texto para leer mejor.
- **Preview lateral** por red con el `SocialPreviewCard` — reemplaza las variables con los samples reales y muestra cómo se verá el post.
- Límite de caracteres por red aplicado (mismo mapping que en el editor).

### 5.3 Brand — [components/BrandConfig.jsx](components/BrandConfig.jsx)

Define el look de *todos* los reels de esta agencia:

- **Identity**: logo (PNG recomendado 512×512), nombre de la agencia (tagline), color primario, color secundario (color pickers), familia tipográfica de headings (Inter / Söhne / Manrope / Plus Jakarta Sans / Helvetica).
- **Watermark**: toggle on/off, posición (4 esquinas), opacidad 30–100.
- **Outro card**: toggle, headline + sub-line. Aparece en los últimos ~2s del reel.
- **Preview 3:4 en vivo** a la derecha que muestra watermark + subtitle strip + outro con los cambios aplicados en tiempo real.

### 5.4 Defaults — [components/ReelDefaultsConfig.jsx](components/ReelDefaultsConfig.jsx)

"Reel defaults / Customization". Seis sub-tabs a la izquierda, panel a la derecha. Todo lo que se fija aquí se aplica a cada reel nuevo, pero puede sobrescribirse desde el editor.

#### 5.4.1 Format & locale
- Moneda (EUR / USD / GBP / CAD / AUD) + posición del símbolo (prefix/suffix).
- Separadores de miles y decimales.
- Rounding de precio: Exact / Nearest 1K / Nearest 10K.
- Formato de fecha (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD MMM YYYY, MMM DD YYYY).
- Formato de hora 24h/12h.
- Timezone.
- Idioma de interfaz (en-IE, en-GB, en-US, es-ES).
- Sistema métrico vs. imperial (m² / km vs ft² / mi).

#### 5.4.2 Subtitles (estilo)
- Tipografía: font, weight (500/600/700/800), tamaño (28–72 px).
- Color de texto, mayúsculas sí/no, max chars por línea, alineación.
- Fondo: None / Pill / Block / Outline, color, opacidad.
- Posición vertical (top/middle/bottom).
- **Karaoke word-highlight**: toggle y color — la palabra que está sonando se resalta.

#### 5.4.3 Video & timing
- **Aspect ratio**: 9:16, 3:4, 1:1, 4:5.
- Resolución: 720p / 1080p / 1440p / 4K.
- FPS: 24 / 30 / 60.
- **Duration strategy**: Auto (por número de fotos) o rango fijo con min/max sliders.
- **Transitions** entre escenas: Hard cut / Crossfade / Slide / Zoom.
- Ken Burns toggle (pan & zoom suave por foto).
- Intro / Outro cards toggles.

#### 5.4.4 Intro & outro (piezas de video)
- **Intro** y **Outro** con misma estructura: toggle enabled, source (uploaded / brand-card / none), duración, archivo con nombre/tamaño/duración.
- **Rules**: Skip en rentals, skip si el reel es <15s, permitir a los agentes desactivarlos por reel.

#### 5.4.5 Audio
- Volumen de música (0–100).
- Fade in / fade out toggles.
- Duck on voice (bajar música cuando hay VO).
- Voiceover enabled por defecto.

#### 5.4.6 Caption generation
- Idioma de los subtítulos.
- Caso (sentence / upper / lower).
- Incluir emoji en subtítulos (sí/no).

---

## 6. Automation — [components/AutomationAdmin.jsx](components/AutomationAdmin.jsx)

**La decisión de negocio más importante** vive aquí. Dos modos mutuamente excluyentes, renderizados como tarjetas grandes:

### 6.1 Modo `Publish automatically`
Hands-off: en cuanto el reel termina de renderizar, se publica. Pensado para agencias con alto volumen.

Detalles configurables:
- **Hold window** — mantener el reel N horas (30 min, 1h, 2h, 4h, 8h, 24h, o custom) antes de postear, como red de seguridad para cancelar/tweakear desde el dashboard.
- **Quiet hours** (22:00 → 07:00) — reels que terminan de noche se postean a las 07:00.
- **Skip weekends** — lo que termine sábado/domingo espera al lunes.
- **Networks por defecto** — chips por red; desactivadas si la red no está conectada.

### 6.2 Modo `Send email before publishing` (review-first)
Cada reel aterriza en estado *Needs review* y un email va a la lista de destinatarios con botones **Approve & publish**, **Open editor**, **Reject** (1-click).

Detalles:
- Lista CSV de emails destinatarios.
- **Preview** del email de aprobación — muestra exactamente lo que recibe el usuario.
- Quiet hours también aplican al envío de emails.

### 6.3 Rendering defaults (común a ambos modos)
- Auto-generar subtítulos.
- Re-render al actualizar datos de la propiedad upstream (si GHL/WP cambian el precio o las fotos, volver a generar el reel).

---

## 7. Admin (super-admin) — [components/AutomationAdmin.jsx](components/AutomationAdmin.jsx) + [components/AgencyDrawer.jsx](components/AgencyDrawer.jsx)

Vista solo para el operador de la plataforma (*tú*, no los agents de cada agencia).

### 7.1 Métricas de plataforma
- Active tenants.
- MRR total.
- Reels renderizados (30d).
- % de renders fallidos.

### 7.2 Tabla `Agencies`
Listado de todos los tenants con: nombre + id, plan, seats, reels/30d, **estado de las dos fuentes** (GHL / WP como pills verde/rojo/amarillo), MRR, status (active / trial / paused), joined.

Click en fila → **AgencyDrawer** lateral.

### 7.3 AgencyDrawer

Drawer derecho de 680 px con tres tabs:

#### Sources
Las dos fuentes de listados que el backend lee para generar reels. Credenciales **solo visibles para el super-admin**.

- **GoHighLevel card**:
  - Location ID (ej. `loc_ABCD1234`).
  - API token (*private integration token*, estilo `pit-...`, con toggle mostrar/ocultar).
  - Botón **Test connection** — valida que el token + location ID son buenos, actualiza `status` y `lastSync`.
  - Mensaje de error inline si la conexión falla (ej. "401 Unauthorized — API key expired 3 days ago").
  - Nota dónde se crea la clave en GHL: `Settings → Integrations → Private Integrations → Create new`.
- **WordPress card**:
  - URL (HTTPS obligatorio).
  - Lee listados desde `/wp-json/wp/v2/`.
  - *Application Password* oculto con toggle.
  - Intervalo de polling (default 5 min).
  - Test connection simulado.
  - Mensajes de error típicos: "REST API returning 403 — Application Password rejected".

#### Billing
Plan, MRR, seats, joined, next invoice, payment method. Botones **Open in Stripe** y **Change plan**.

#### Activity
Log reciente de eventos: publicaciones, syncs, cambios de plan, altas de seats, etc.

### 7.4 Invite agency
Modal desde el header ("+ Invite agency") para dar de alta un tenant: nombre, admin name, admin email, toggle *Send magic-link invitation now*. Luego se configuran sus sources en el drawer.

### 7.5 Team & permissions — [components/AdminTeam.jsx](components/AdminTeam.jsx)

> Nota: este panel está implementado pero aún no está enlazado desde `AdminView`. Es el módulo de gestión del equipo *dentro de una agencia* (no super-admin), y se montará cuando se añada sub-navegación al Admin.

- **Security policy** (aplica a todos los miembros):
  - Require 2FA (bloquea login hasta que cada miembro active 2FA; avisa cuántos no lo tienen).
  - SSO on/off + provider (Google Workspace / Microsoft 365 · Azure AD / Okta SAML / Custom SAML) + dominio permitido.
  - Session timeout (1h / 4h / 8h / 24h / 7d).
  - Default role para usuarios SSO nuevos.
- **Filtros por rol** (All / Admin / Editor / Viewer) con contadores, + "pending invites", + acceso al modal **View role permissions**.
- **Tabla de miembros**: avatar, email, rol (editable inline), 2FA enabled/off, SSO linked/—, status (active/invited/suspended), last active.
- **Selección múltiple** con acciones bulk: cambiar rol, eliminar.
- **Invite members modal** — añade emails con rol.
- **Edit user modal** — cambia rol, permite ver desc del rol.
- **Role permissions modal** — matriz de permisos por módulo × rol (reels / publish / music / brand / automation / admin / api) con valores `rw` / `ro` / `none`. Tres roles fijos: **Admin** (rw en todo), **Editor** (rw en reels/publish/music/brand, ro en automation, none en admin/api), **Viewer** (ro en casi todo, none en publish/admin/api).

---

## 8. Notification Settings

Modal en [components/App.jsx](components/App.jsx) (`NotificationSettings`). Accesible desde el icono de campana en la topbar.

- **Channels**: Email / Slack (`#listings`) / SMS (solo para failures urgentes). Toggle por canal.
- **Recipients**: lista de destinatarios. Cada uno con su email, nombre, rol y *qué eventos quiere recibir*:
  - Needs approval
  - Published
  - Failed render
- Añadir nuevo email (Enter o botón Add).
- Eliminar destinatario.
- **Delivery frequency**: Instant / Hourly digest / Daily digest (09:00).

---

## 9. Modelo de datos (mock)

Definido en [data/mock.js](data/mock.js). Los componentes acceden vía `window.MOCK`.

| Entidad | Campos clave |
|---|---|
| `agency` | `name`, `tenantId`, `plan`, `logo`, `color` |
| `socials[]` | `id`, `name`, `icon`, `color`, `connected`, `handle` (Instagram, TikTok, YouTube, Facebook, LinkedIn, Google Business) |
| `reels[]` | `id`, `title`, `address`, `price`, `status`, `publishStatus`, `cover`, `createdAt`, `duration`, `scenes`, `music`, `kind` (for-sale/sale-agreed/sold/to-let/let-agreed/let), `type` (luxury/family/rental), `networks[]`, `tracker: { views, clicks, ctr, topNet, clicks7d[], clicks30d[] }` |
| `tracks[]` | `id`, `title`, `artist`, `bpm`, `duration`, `mood[]`, `propertyTypes[]`, `statuses[]`, `favorite`, `waveform[]` |
| `defaultBlocks[]` | bloques base de la descripción (title / emoji / price / features / text / cta / hashtags) |
| `variables[]` | catálogo de tokens `{{...}}` disponibles |
| `tenants[]` | agencias dadas de alta en la plataforma (super-admin) |
| `team[]` | miembros del tenant activo con rol, 2FA, SSO, lastSeen |
| `roles[]` | Admin / Editor / Viewer con matriz de permisos por módulo |

---

## 10. Tracking de links (analytics)

Toda publicación que 4reels hace lleva un **short link** propio. Las métricas que el backend devuelve y el frontend ya visualiza:

- `views` — impresiones del reel.
- `clicks` — clicks al short link (CTAs, booking_link).
- `ctr` — porcentaje, con semáforo en Dashboard: >1.5% verde, 1–1.5% amarillo, <1% gris.
- `topNet` — la red de la que vienen más clicks.
- `clicks7d[]` y `clicks30d[]` — series diarias que el sparkline del dashboard pinta.

El `TrackerStats` card se integra en cada ReelCard y permite togglear entre 7d / 30d sin salir del dashboard.

---

## 11. Theming, branding técnico y assets

- Theming via CSS variables. Toggle claro/oscuro con `data-theme` en el `<html>`. Persistido en `localStorage`.
- Fuentes **Inter** y **JetBrains Mono** empaquetadas localmente (via `@fontsource`, sin CDN).
- Iconografía propia, stroke-based estilo Lucide, en [components/Icon.jsx](components/Icon.jsx). ~60 iconos.
- **Assets estáticos** en `public/assets/` (logo de CK, fotos reales del piso de Cranford Court usadas como muestras, vídeo `reel.mp4` que reproduce en todos los previews) y `public/uploads/`.

---

## 12. Integraciones de plataforma (lo que el backend debe cumplir)

Resumiendo los contratos que el frontend *espera*:

### 12.1 Ingesta
- **GoHighLevel**: lectura de *opportunities/contacts/custom fields* via Private Integration Token + Location ID. Los campos que se consumen incluyen precio, fotos, descripción, estado del pipeline (ej. "Listed").
- **WordPress**: lectura de Custom Post Type configurable (default `property`) via REST (`/wp-json/wp/v2/<cpt>`), autenticado con Application Password. Polling cada N minutos.

### 12.2 Rendering
- Input: fotos seleccionadas (+ AI scores) + subtítulos + música elegida + brand + defaults.
- Output: MP4 3:4 (o el aspect ratio configurado) con subs quemados, intro/outro, watermark, música, voiceover opcional (mezcla con ducking).

### 12.3 Publicación
- APIs nativas de Instagram (Reels), TikTok, YouTube (Shorts), Facebook (Reels), LinkedIn, Google Business Profile.
- Un short-link por publicación que redirige al `booking_link` y logea view/click.

### 12.4 Aprobaciones
- Emails transaccionales con links firmados de 1 click: `approve`, `reject`, `open editor`.

### 12.5 Webhooks salientes (futuros)
- Eventos `reel.published`, `reel.failed`, `reel.needs_approval` — consumibles desde GHL para workflows downstream.

---

## 13. Estructura del código

```
4reels (2)/
├── index.html                      ← entry Vite
├── src/
│   ├── main.jsx                    ← imports React + fuentes + componentes en orden
│   └── globals.js                  ← puente window.React / window.ReactDOM
├── styles.css                      ← theme CSS (variables, componentes base)
├── data/mock.js                    ← window.MOCK (datos de demo)
├── components/
│   ├── App.jsx                     ← shell: topbar + routing de tabs + NotificationSettings + TweaksPanel
│   ├── Dashboard.jsx               ← listado de reels + TrackerStats + Sparkline + ReelCard
│   ├── ReelEditor.jsx              ← editor con Photos / Subtitles / Descriptions / Slides / Voiceover
│   ├── MusicConfig.jsx             ← library + rules
│   ├── SocialConfig.jsx            ← conexiones + plantillas por red + SocialPreviewCard
│   ├── BrandConfig.jsx             ← logo, colores, watermark, outro + preview en vivo
│   ├── ReelDefaultsConfig.jsx      ← format / subs / video / intro-outro / audio / captions
│   ├── AutomationAdmin.jsx         ← Automation (auto vs review) + Admin super-admin (Agencies)
│   ├── AdminTeam.jsx               ← team & permissions + SSO/2FA policy + role matrix
│   ├── AgencyDrawer.jsx            ← drawer por agencia: sources / billing / activity
│   ├── Cover.jsx                   ← video/imagen placeholder para todos los previews
│   ├── Icon.jsx                    ← ~60 iconos SVG inline
│   └── UI.jsx                      ← primitives: Toggle, Checkbox, Avatar, Segmented, StatusBadge, KindBadge, SocialDot, EmptyBox
└── public/
    ├── assets/                     ← logo, fotos reales del listado de muestra, reel.mp4
    └── uploads/                    ← sample uploads
```

El proyecto corre sobre **Vite + React 18** (ver [package.json](package.json)). Las dependencias (React, ReactDOM, fuentes) se sirven desde `node_modules`, sin CDN.

---

## 14. Lo que **no** existe todavía en el frontend

Para que no haya dudas de scope, esto aún no está wireado (pero el producto final lo necesitará):

- Backend real — todo es mock; ningún botón persiste contra una API.
- Auth real (login / logout / password reset) — la app asume usuario ya logueado.
- Panel de facturación para el tenant (el super-admin sí lo ve desde el drawer).
- Logs de errores de render para el agente (existen para el super-admin en Activity).
- Panel de **Team** dentro de la vista Admin del tenant — el componente `AdminTeam` existe pero aún no está enlazado en la navegación.
- Onboarding inicial de agencia (pantallas de setup por primera vez).
- Tooltips/ayuda contextual uniformes.

---

## 15. Glosario rápido

- **Reel** — pieza de video vertical generada desde un listado.
- **Scene / slide** — unidad dentro del reel; puede ser una foto con Ken Burns, un intro/outro, un text slide o una reseña de Google.
- **Tenant / agency** — cliente de 4reels.
- **Source** — origen de listados (GHL o WP).
- **Publish mode** — auto vs review-first.
- **Favorite track** — track musical elegible para selección automática.
- **Hold window** — margen de cancelación/edición tras el render antes de postear.
- **Ducking** — bajar música cuando hay voz.
- **Karaoke highlight** — palabra actual resaltada en los subtítulos.
- **Short link tracker** — link firmado que mide views/clicks por red.
