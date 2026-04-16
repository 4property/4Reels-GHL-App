import './style.css'

const app = document.querySelector('#app')

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'music', label: 'Music' },
  { id: 'reel', label: 'Reel Customization' },
  { id: 'poster', label: 'Poster' },
  { id: 'voiceover', label: 'Voiceover' },
  { id: 'social', label: 'Social Networks' },
  { id: 'summary', label: 'Summary' },
]

const networks = ['instagram', 'facebook', 'tiktok', 'youtube']

const photoAssets = {
  exterior: '/selected_photos/05_3483-2.jpg',
  living: '/selected_photos/primary_image.jpg',
  green: '/selected_photos/01_3483-21.jpg',
  kitchen: '/selected_photos/02_3483-10.jpg',
  bedroom: '/selected_photos/03_3483-17.jpg',
  bathroom: '/selected_photos/04_3483-13.jpg',
}

let nextId = 100
let dragSlideId = null
let mediaRecorder = null
let recordingStream = null
let recordedChunks = []
let recordingTimer = null

const state = {
  activeTab: 'dashboard',
  publishMode: 'manual',
  selectedJobId: 'job-1',
  selectedSlideId: 'slide-2',
  selectedTrackId: 'track-1',
  selectedNetwork: 'instagram',
  captionsHidden: false,
  reelDefaults: true,
  reelEndPosition: 'end',
  randomMusic: true,
  defaultTrackId: 'track-1',
  defaultSlideId: 'slide-1',
  posterStatus: 'Sale Agreed',
  posterText: 'Sale Agreed',
  posterVideoEnabled: false,
  posterVideoName: '',
  posterVideoUrl: '',
  voiceNotes: 'Keep the tone warm, local and easy to understand.',
  fields: {
    address: '12 Cranford Court',
    area: 'West London',
    price: 'GBP 325,000',
    agent: 'Anna Case',
  },
  socialTemplates: {
    instagram: 'Just listed at {address}. {price}. DM {agent} to arrange a viewing.',
    facebook:
      'New to market in {area}. {address} is now live for {price}. Contact {agent} for the brochure.',
    tiktok: 'Fresh listing alert at {address}. Comment TOUR and {agent} will reach out.',
    youtube:
      'Full walkthrough for {address} in {area}. Enquire with {agent} to book a viewing.',
  },
  recordingSupported:
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices && window.MediaRecorder),
  recordingState: 'idle',
  recordingSeconds: 0,
  recordingUrl: '',
  jobs: [
    {
      id: 'job-1',
      title: 'Cranford Court Reel',
      type: 'Reel',
      status: 'Needs approval',
      updated: 'Today 10:24',
      owner: 'Anna Case',
      coverUrl: photoAssets.exterior,
    },
    {
      id: 'job-2',
      title: 'Cranford Court Poster',
      type: 'Poster',
      status: 'Draft',
      updated: 'Today 09:18',
      owner: 'Anna Case',
      coverUrl: photoAssets.living,
    },
    {
      id: 'job-3',
      title: 'Harbour Road Reel',
      type: 'Reel',
      status: 'Published',
      updated: 'Yesterday 17:42',
      owner: 'James Cole',
      coverUrl: photoAssets.green,
    },
    {
      id: 'job-4',
      title: 'Oakview Poster',
      type: 'Poster',
      status: 'Needs approval',
      updated: 'Yesterday 16:10',
      owner: 'Anna Case',
      coverUrl: photoAssets.bedroom,
    },
  ],
  slides: [
    {
      id: 'slide-1',
      name: 'Exterior hero',
      type: 'image',
      caption: 'Open with the exterior and shared lawn.',
      previewUrl: photoAssets.exterior,
    },
    {
      id: 'slide-2',
      name: 'Living room',
      type: 'image',
      caption: 'Show the bright living space and soft natural light.',
      previewUrl: photoAssets.living,
    },
    {
      id: 'slide-3',
      name: 'Kitchen',
      type: 'image',
      caption: 'Use a quick kitchen shot before the closing frame.',
      previewUrl: photoAssets.kitchen,
    },
    {
      id: 'slide-4',
      name: 'Bedroom',
      type: 'image',
      caption: 'Keep the bedroom frame calm and tidy.',
      previewUrl: photoAssets.bedroom,
    },
    {
      id: 'slide-5',
      name: 'Bathroom',
      type: 'image',
      caption: 'Finish with the bathroom to complete the tour.',
      previewUrl: photoAssets.bathroom,
    },
  ],
  tracks: [
    { id: 'track-1', name: 'Morning Keys', liked: true, uploaded: true, duration: '01:18' },
    { id: 'track-2', name: 'Open House', liked: true, uploaded: true, duration: '01:42' },
    { id: 'track-3', name: 'Clean Horizon', liked: false, uploaded: false, duration: '00:57' },
  ],
}

function createId(prefix) {
  nextId += 1
  return `${prefix}-${nextId}`
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
    return map[character]
  })
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

function countJobs(status) {
  return state.jobs.filter((job) => job.status === status).length
}

function getJob() {
  return state.jobs.find((job) => job.id === state.selectedJobId) || state.jobs[0]
}

function getSlide() {
  return state.slides.find((slide) => slide.id === state.selectedSlideId) || state.slides[0]
}

function getTrack() {
  return state.tracks.find((track) => track.id === state.selectedTrackId) || state.tracks[0]
}

function getDefaultSlide() {
  return state.slides.find((slide) => slide.id === state.defaultSlideId) || state.slides[0]
}

function getDefaultTrack() {
  return state.tracks.find((track) => track.id === state.defaultTrackId) || state.tracks[0]
}

function getLikedTracks() {
  return state.tracks.filter((track) => track.liked)
}

function syncState() {
  if (!state.jobs.some((job) => job.id === state.selectedJobId)) state.selectedJobId = state.jobs[0]?.id || ''
  if (!state.slides.some((slide) => slide.id === state.selectedSlideId)) state.selectedSlideId = state.slides[0]?.id || ''
  if (!state.slides.some((slide) => slide.id === state.defaultSlideId)) state.defaultSlideId = state.slides[0]?.id || ''
  if (!state.tracks.some((track) => track.id === state.selectedTrackId)) state.selectedTrackId = state.tracks[0]?.id || ''
  if (!state.tracks.some((track) => track.id === state.defaultTrackId)) state.defaultTrackId = state.tracks[0]?.id || ''
}

function resolveTemplate(template) {
  return template.replace(/\{(\w+)\}/g, (_, token) => state.fields[token] || `{${token}}`)
}

function renderBadge(status) {
  const tone = status === 'Published' ? 'success' : status === 'Needs approval' ? 'warning' : 'neutral'
  return `<span class="badge badge-${tone}">${escapeHtml(status)}</span>`
}

function renderMedia(item, className = 'media-frame') {
  if (item.type === 'video') {
    return `<div class="${className}"><video src="${escapeHtml(item.previewUrl)}" muted loop playsinline autoplay></video></div>`
  }
  return `<div class="${className}"><img src="${escapeHtml(item.previewUrl)}" alt="${escapeHtml(item.name)}" /></div>`
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="title-group">
        <p class="eyebrow">GHL Listing CRM</p>
        <h1>Estate agent content workflow</h1>
        <p class="subtle-copy">Manage reels, posters, approvals, voiceover and social publishing from one clean workspace.</p>
      </div>
      <div class="mode-switch">
        <button class="mode-button${state.publishMode === 'manual' ? ' is-active' : ''}" type="button" data-action="set-mode" data-mode="manual">Manual approval</button>
        <button class="mode-button${state.publishMode === 'auto' ? ' is-active' : ''}" type="button" data-action="set-mode" data-mode="auto">Auto publish</button>
      </div>
    </header>
  `
}

function renderStats() {
  return `
    <section class="stats-grid">
      <article class="stat-card"><span>Needs approval</span><strong>${countJobs('Needs approval')}</strong></article>
      <article class="stat-card"><span>Drafts</span><strong>${countJobs('Draft')}</strong></article>
      <article class="stat-card"><span>Published</span><strong>${countJobs('Published')}</strong></article>
      <article class="stat-card"><span>Default music</span><strong>${escapeHtml(getDefaultTrack().name)}</strong></article>
    </section>
  `
}

function renderTabs() {
  return `
    <nav class="tabs" aria-label="Main navigation">
      ${tabs.map((tab) => `<button class="tab-button${state.activeTab === tab.id ? ' is-active' : ''}" type="button" data-action="switch-tab" data-tab-id="${tab.id}">${escapeHtml(tab.label)}</button>`).join('')}
    </nav>
  `
}

function renderDashboard() {
  const job = getJob()

  return `
    <section class="page-grid">
      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Publishing queue</p>
            <h2>Reels and posters awaiting action</h2>
          </div>
          <div class="panel-actions">
            <button class="ghost-button" type="button" data-action="open-job-editor">Edit selected</button>
            <button class="primary-button" type="button" data-action="approve-job" data-job-id="${job.id}" ${job.status === 'Published' ? 'disabled' : ''}>Approve selected</button>
          </div>
        </div>

        <div class="table">
          <div class="table-head">
            <span>Item</span>
            <span>Type</span>
            <span>Status</span>
            <span>Updated</span>
          </div>
          ${state.jobs
            .map(
              (item) => `
                <button class="table-row${state.selectedJobId === item.id ? ' is-selected' : ''}" type="button" data-action="select-job" data-job-id="${item.id}">
                  <span class="table-primary">
                    <strong>${escapeHtml(item.title)}</strong>
                    <small>${escapeHtml(item.owner)}</small>
                  </span>
                  <span>${escapeHtml(item.type)}</span>
                  <span>${renderBadge(item.status)}</span>
                  <span>${escapeHtml(item.updated)}</span>
                </button>
              `,
            )
            .join('')}
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Selected item</p>
            <h2>${escapeHtml(job.title)}</h2>
          </div>
          ${renderBadge(job.status)}
        </div>

        ${renderMedia({ name: job.title, type: 'image', previewUrl: job.coverUrl }, 'asset-preview')}

        <div class="summary-list">
          <div class="summary-row"><span>Owner</span><strong>${escapeHtml(job.owner)}</strong></div>
          <div class="summary-row"><span>Type</span><strong>${escapeHtml(job.type)}</strong></div>
          <div class="summary-row"><span>Updated</span><strong>${escapeHtml(job.updated)}</strong></div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Workflow defaults</p>
            <h2>Current configuration</h2>
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-row"><span>Publish mode</span><strong data-bind="publish-mode">${escapeHtml(state.publishMode === 'auto' ? 'Auto publish' : 'Manual approval')}</strong></div>
          <div class="summary-row"><span>Default slide</span><strong>${escapeHtml(getDefaultSlide().name)}</strong></div>
          <div class="summary-row"><span>Default music</span><strong>${escapeHtml(getDefaultTrack().name)}</strong></div>
          <div class="summary-row"><span>Captions</span><strong>${escapeHtml(state.captionsHidden ? 'Removed by default' : 'Visible')}</strong></div>
        </div>
      </article>
    </section>
  `
}

function renderMusic() {
  const likedTracks = getLikedTracks()
  const selectedTrack = getTrack()

  return `
    <section class="page-grid">
      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Music library</p>
            <h2>Upload tracks and define the default playlist</h2>
          </div>
          <div class="panel-actions">
            <button class="ghost-button${state.randomMusic ? ' is-active' : ''}" type="button" data-action="toggle-random">Use liked tracks as default playlist</button>
          </div>
        </div>

        <label class="dropzone" data-dropzone="music">
          <span>Drag and drop music here</span>
          <small>MP3, WAV, AAC and OGG files are accepted.</small>
          <input class="sr-only" type="file" accept="audio/*" multiple data-upload="music" />
        </label>

        <div class="list-grid">
          ${state.tracks
            .map(
              (track) => `
                <article class="list-row${state.selectedTrackId === track.id ? ' is-selected' : ''}">
                  <button class="row-main" type="button" data-action="select-track" data-track-id="${track.id}">
                    <strong>${escapeHtml(track.name)}</strong>
                    <span>${escapeHtml(track.duration)}${track.uploaded ? '  Uploaded' : '  Library'}</span>
                  </button>
                  <div class="row-actions">
                    <button class="mini-button${track.liked ? ' is-active' : ''}" type="button" data-action="toggle-like" data-track-id="${track.id}">Like</button>
                    <button class="mini-button${state.defaultTrackId === track.id ? ' is-active' : ''}" type="button" data-action="set-default-track" data-track-id="${track.id}">Default</button>
                  </div>
                </article>
              `,
            )
            .join('')}
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Selected track</p>
            <h2>${escapeHtml(selectedTrack.name)}</h2>
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-row"><span>Duration</span><strong>${escapeHtml(selectedTrack.duration)}</strong></div>
          <div class="summary-row"><span>Liked tracks</span><strong>${likedTracks.length}</strong></div>
          <div class="summary-row"><span>Default</span><strong>${escapeHtml(getDefaultTrack().name)}</strong></div>
        </div>

        <div class="tag-cloud">
          ${likedTracks.map((track) => `<span>${escapeHtml(track.name)}</span>`).join('')}
        </div>
      </article>
    </section>
  `
}

function renderSlideRow(slide, index) {
  const isSelected = state.selectedSlideId === slide.id
  const isDefault = state.defaultSlideId === slide.id

  return `
    <article class="slide-row${isSelected ? ' is-selected' : ''}" draggable="true" data-slide-row data-slide-id="${slide.id}">
      <button class="row-main slide-main" type="button" data-action="select-slide" data-slide-id="${slide.id}">
        <span class="drag-handle" aria-hidden="true"></span>
        ${renderMedia(slide, 'thumb-frame')}
        <span class="slide-copy">
          <strong>${escapeHtml(slide.name)}</strong>
          <small>${escapeHtml(slide.type)}${isDefault ? '  Default slide' : ''}</small>
        </span>
      </button>

      <div class="row-actions">
        <button class="mini-button" type="button" data-action="move-slide-up" data-slide-id="${slide.id}" ${index === 0 ? 'disabled' : ''}>Up</button>
        <button class="mini-button" type="button" data-action="move-slide-down" data-slide-id="${slide.id}" ${index === state.slides.length - 1 ? 'disabled' : ''}>Down</button>
      </div>
    </article>
  `
}

function renderReel() {
  const slide = getSlide()

  return `
    <section class="page-grid">
      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Reel customization</p>
            <h2>Order slides, set defaults and control captions</h2>
          </div>
          <div class="panel-actions">
            <button class="ghost-button${state.reelDefaults ? ' is-active' : ''}" type="button" data-action="toggle-reel-defaults">Save these settings as default</button>
            <button class="ghost-button${state.captionsHidden ? ' is-active' : ''}" type="button" data-action="toggle-captions">Remove all captions</button>
          </div>
        </div>

        <label class="dropzone" data-dropzone="slides">
          <span>Drag and drop slide media here</span>
          <small>Photos and videos can be added to the reel sequence.</small>
          <input class="sr-only" type="file" accept="image/*,video/*" multiple data-upload="slides" />
        </label>

        <div class="segmented">
          ${['start', 'middle', 'end']
            .map(
              (position) => `
                <button class="segment-button${state.reelEndPosition === position ? ' is-active' : ''}" type="button" data-action="set-end-position" data-position="${position}">
                  Extra media at ${escapeHtml(position)}
                </button>
              `,
            )
            .join('')}
        </div>

        <div class="list-grid">
          ${state.slides.map((item, index) => renderSlideRow(item, index)).join('')}
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Selected slide</p>
            <h2>${escapeHtml(slide.name)}</h2>
          </div>
          <button class="ghost-button${state.defaultSlideId === slide.id ? ' is-active' : ''}" type="button" data-action="set-default-slide" data-slide-id="${slide.id}">
            ${state.defaultSlideId === slide.id ? 'Default slide' : 'Use as default slide'}
          </button>
        </div>

        <div class="phone-preview">
          ${renderMedia(slide, 'phone-frame')}
          ${state.captionsHidden ? '' : `<div class="caption-overlay" data-bind="slide-caption">${escapeHtml(slide.caption)}</div>`}
        </div>

        <label class="field">
          <span>Caption</span>
          <textarea rows="4" data-input="slide-caption">${escapeHtml(slide.caption)}</textarea>
        </label>

        <div class="summary-list">
          <div class="summary-row"><span>Type</span><strong>${escapeHtml(slide.type)}</strong></div>
          <div class="summary-row"><span>Default slide</span><strong>${escapeHtml(getDefaultSlide().name)}</strong></div>
          <div class="summary-row"><span>Extra media position</span><strong>${escapeHtml(state.reelEndPosition)}</strong></div>
        </div>
      </article>
    </section>
  `
}

function renderPoster() {
  const coverSlide = getDefaultSlide()

  return `
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Poster setup</p>
            <h2>Status banner and end video</h2>
          </div>
        </div>

        <div class="segmented vertical">
          ${['Sold', 'Agreed', 'Sale Agreed']
            .map(
              (status) => `
                <button class="segment-button${state.posterStatus === status ? ' is-active' : ''}" type="button" data-action="set-poster-status" data-status="${status}">
                  ${escapeHtml(status)}
                </button>
              `,
            )
            .join('')}
        </div>

        <label class="field">
          <span>Poster banner text</span>
          <input type="text" value="${escapeHtml(state.posterText)}" data-input="poster-text" />
        </label>

        <button class="ghost-button${state.posterVideoEnabled ? ' is-active' : ''}" type="button" data-action="toggle-poster-video">Attach poster end video</button>

        <label class="dropzone compact" data-dropzone="poster-video">
          <span>Drag and drop end video</span>
          <small>${escapeHtml(state.posterVideoName || 'No poster end video uploaded yet.')}</small>
          <input class="sr-only" type="file" accept="video/*" data-upload="poster-video" />
        </label>
      </article>

      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Poster preview</p>
            <h2>${escapeHtml(state.posterText)}</h2>
          </div>
        </div>

        <div class="poster-canvas">
          ${renderMedia(coverSlide, 'poster-frame')}
          <div class="poster-banner" data-bind="poster-text">${escapeHtml(state.posterText)}</div>
        </div>

        <div class="summary-list inline">
          <div class="summary-row"><span>Base image</span><strong>${escapeHtml(coverSlide.name)}</strong></div>
          <div class="summary-row"><span>End video</span><strong>${escapeHtml(state.posterVideoEnabled ? 'Attached' : 'Not attached')}</strong></div>
          <div class="summary-row"><span>File</span><strong>${escapeHtml(state.posterVideoName || 'None')}</strong></div>
        </div>
      </article>
    </section>
  `
}

function renderVoiceover() {
  const slide = getSlide()
  const status =
    state.recordingState === 'recording'
      ? `Recording ${formatTime(state.recordingSeconds)}`
      : state.recordingState === 'ready'
        ? 'Recording ready'
        : state.recordingState === 'blocked'
          ? 'Microphone access blocked'
          : 'Ready to record'

  return `
    <section class="page-grid">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Preview</p>
            <h2>${escapeHtml(slide.name)}</h2>
          </div>
        </div>

        <div class="phone-preview">
          ${renderMedia(slide, 'phone-frame')}
          <div class="caption-overlay secondary">Record while the preview is playing.</div>
        </div>
      </article>

      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Voiceover</p>
            <h2>${escapeHtml(status)}</h2>
          </div>
          ${renderBadge(state.recordingUrl ? 'Published' : 'Draft')}
        </div>

        <div class="panel-actions wide">
          <button class="primary-button" type="button" data-action="start-recording" ${state.recordingState === 'recording' || !state.recordingSupported ? 'disabled' : ''}>Start recording</button>
          <button class="ghost-button" type="button" data-action="stop-recording" ${state.recordingState !== 'recording' ? 'disabled' : ''}>Stop</button>
          <button class="ghost-button" type="button" data-action="clear-recording" ${!state.recordingUrl ? 'disabled' : ''}>Clear</button>
        </div>

        ${state.recordingUrl ? `<audio class="audio-player" controls src="${escapeHtml(state.recordingUrl)}"></audio>` : ''}

        <label class="field">
          <span>Voiceover notes</span>
          <textarea rows="5" data-input="voice-notes">${escapeHtml(state.voiceNotes)}</textarea>
        </label>
      </article>
    </section>
  `
}

function renderSocial() {
  const resolved = resolveTemplate(state.socialTemplates[state.selectedNetwork])

  return `
    <section class="page-grid">
      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Social descriptions</p>
            <h2>Change the publish text for each network</h2>
          </div>
        </div>

        <div class="segmented">
          ${networks
            .map(
              (network) => `
                <button class="segment-button${state.selectedNetwork === network ? ' is-active' : ''}" type="button" data-action="select-network" data-network="${network}">
                  ${escapeHtml(network)}
                </button>
              `,
            )
            .join('')}
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Template</span>
            <textarea rows="6" data-input="social-template">${escapeHtml(state.socialTemplates[state.selectedNetwork])}</textarea>
          </label>

          <div class="field-group">
            <p class="eyebrow">Editable property fields</p>
            <div class="mini-field-grid">
              <label class="field">
                <span>Address</span>
                <input type="text" value="${escapeHtml(state.fields.address)}" data-input="field" data-field-name="address" />
              </label>
              <label class="field">
                <span>Area</span>
                <input type="text" value="${escapeHtml(state.fields.area)}" data-input="field" data-field-name="area" />
              </label>
              <label class="field">
                <span>Price</span>
                <input type="text" value="${escapeHtml(state.fields.price)}" data-input="field" data-field-name="price" />
              </label>
              <label class="field">
                <span>Agent</span>
                <input type="text" value="${escapeHtml(state.fields.agent)}" data-input="field" data-field-name="agent" />
              </label>
            </div>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Resolved preview</p>
            <h2>${escapeHtml(state.selectedNetwork)}</h2>
          </div>
        </div>

        <div class="text-preview" data-bind="social-preview">${escapeHtml(resolved)}</div>
      </article>
    </section>
  `
}

function renderSummary() {
  const job = getJob()
  const publishLabel = state.publishMode === 'auto' ? 'Publish automatically' : 'Send to approval'

  return `
    <section class="page-grid">
      <article class="panel span-2">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Final review</p>
            <h2>${escapeHtml(job.title)}</h2>
          </div>
          ${renderBadge(job.status)}
        </div>

        <div class="summary-columns">
          <div class="summary-list">
            <div class="summary-row"><span>Publish mode</span><strong>${escapeHtml(state.publishMode === 'auto' ? 'Auto publish' : 'Manual approval')}</strong></div>
            <div class="summary-row"><span>Default slide</span><strong>${escapeHtml(getDefaultSlide().name)}</strong></div>
            <div class="summary-row"><span>Default track</span><strong>${escapeHtml(getDefaultTrack().name)}</strong></div>
            <div class="summary-row"><span>Captions</span><strong>${escapeHtml(state.captionsHidden ? 'Removed' : 'Visible')}</strong></div>
            <div class="summary-row"><span>Poster banner</span><strong>${escapeHtml(state.posterText)}</strong></div>
            <div class="summary-row"><span>Voiceover</span><strong>${escapeHtml(state.recordingUrl ? 'Ready' : 'Missing')}</strong></div>
          </div>

          <div class="summary-list">
            ${state.slides
              .map(
                (slide, index) => `
                  <div class="summary-row">
                    <span>Slide ${index + 1}</span>
                    <strong>${escapeHtml(slide.name)}</strong>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Output action</p>
            <h2>${escapeHtml(publishLabel)}</h2>
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-row"><span>Selected network</span><strong>${escapeHtml(state.selectedNetwork)}</strong></div>
          <div class="summary-row"><span>Template preview</span><strong>${escapeHtml(resolveTemplate(state.socialTemplates[state.selectedNetwork]))}</strong></div>
        </div>

        <button class="primary-button full" type="button" data-action="send-selected-output">${escapeHtml(publishLabel)}</button>
      </article>
    </section>
  `
}

function renderPage() {
  if (state.activeTab === 'dashboard') return renderDashboard()
  if (state.activeTab === 'music') return renderMusic()
  if (state.activeTab === 'reel') return renderReel()
  if (state.activeTab === 'poster') return renderPoster()
  if (state.activeTab === 'voiceover') return renderVoiceover()
  if (state.activeTab === 'social') return renderSocial()
  return renderSummary()
}

function renderApp() {
  syncState()
  app.innerHTML = `<main class="crm-app">${renderTopbar()}${renderStats()}${renderTabs()}<section class="workspace">${renderPage()}</section></main>`
}

function reorderSlides(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return
  const sourceIndex = state.slides.findIndex((slide) => slide.id === sourceId)
  const targetIndex = state.slides.findIndex((slide) => slide.id === targetId)
  if (sourceIndex === -1 || targetIndex === -1) return
  const updated = [...state.slides]
  const [moved] = updated.splice(sourceIndex, 1)
  updated.splice(targetIndex, 0, moved)
  state.slides = updated
}

function addSlides(fileList) {
  const files = Array.from(fileList).filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
  if (!files.length) return
  const newSlides = files.map((file) => ({
    id: createId('slide'),
    name: file.name.replace(/\.[^.]+$/, ''),
    type: file.type.startsWith('video/') ? 'video' : 'image',
    caption: 'New uploaded slide caption.',
    previewUrl: URL.createObjectURL(file),
  }))
  state.slides = [...state.slides, ...newSlides]
  state.selectedSlideId = newSlides[0].id
  renderApp()
}

function addTracks(fileList) {
  const files = Array.from(fileList).filter((file) => file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg)$/i.test(file.name))
  if (!files.length) return
  const newTracks = files.map((file) => ({
    id: createId('track'),
    name: file.name.replace(/\.[^.]+$/, ''),
    liked: true,
    uploaded: true,
    duration: '01:00',
  }))
  state.tracks = [...state.tracks, ...newTracks]
  state.selectedTrackId = newTracks[0].id
  renderApp()
}

function setPosterVideo(file) {
  if (!file || !file.type.startsWith('video/')) return
  if (state.posterVideoUrl) URL.revokeObjectURL(state.posterVideoUrl)
  state.posterVideoEnabled = true
  state.posterVideoName = file.name
  state.posterVideoUrl = URL.createObjectURL(file)
  renderApp()
}

function syncLiveBindings() {
  const slide = getSlide()
  document.querySelectorAll('[data-bind="slide-caption"]').forEach((node) => { node.textContent = slide.caption })
  document.querySelectorAll('[data-bind="poster-text"]').forEach((node) => { node.textContent = state.posterText })
  document.querySelectorAll('[data-bind="social-preview"]').forEach((node) => { node.textContent = resolveTemplate(state.socialTemplates[state.selectedNetwork]) })
  document.querySelectorAll('[data-bind="publish-mode"]').forEach((node) => { node.textContent = state.publishMode === 'auto' ? 'Auto publish' : 'Manual approval' })
}

async function startRecording() {
  if (!state.recordingSupported || state.recordingState === 'recording') return

  try {
    recordedChunks = []
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(recordingStream)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data)
    }

    mediaRecorder.onstop = () => {
      if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl)
      const blob = new Blob(recordedChunks, { type: 'audio/webm' })
      state.recordingUrl = URL.createObjectURL(blob)
      state.recordingState = 'ready'
      state.recordingSeconds = 0
      if (recordingStream) recordingStream.getTracks().forEach((track) => track.stop())
      recordingStream = null
      renderApp()
    }

    mediaRecorder.start()
    state.recordingState = 'recording'
    state.recordingSeconds = 0
    if (recordingTimer) clearInterval(recordingTimer)
    recordingTimer = window.setInterval(() => {
      state.recordingSeconds += 1
      renderApp()
    }, 1000)
    renderApp()
  } catch {
    state.recordingState = 'blocked'
    renderApp()
  }
}

function stopRecording() {
  if (!mediaRecorder || state.recordingState !== 'recording') return
  if (recordingTimer) clearInterval(recordingTimer)
  recordingTimer = null
  mediaRecorder.stop()
}

function clearRecording() {
  if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl)
  state.recordingUrl = ''
  state.recordingState = 'idle'
  state.recordingSeconds = 0
  renderApp()
}

function handleClick(event) {
  const target = event.target.closest('[data-action]')
  if (!target) return

  const action = target.dataset.action

  if (action === 'switch-tab') state.activeTab = target.dataset.tabId
  if (action === 'set-mode') state.publishMode = target.dataset.mode
  if (action === 'select-job') state.selectedJobId = target.dataset.jobId
  if (action === 'open-job-editor') state.activeTab = getJob().type === 'Poster' ? 'poster' : 'reel'
  if (action === 'approve-job') {
    const job = state.jobs.find((item) => item.id === target.dataset.jobId)
    if (job) {
      job.status = 'Published'
      job.updated = 'Just now'
    }
  }
  if (action === 'toggle-random') state.randomMusic = !state.randomMusic
  if (action === 'select-track') state.selectedTrackId = target.dataset.trackId
  if (action === 'toggle-like') {
    const track = state.tracks.find((item) => item.id === target.dataset.trackId)
    if (track) track.liked = !track.liked
  }
  if (action === 'set-default-track') state.defaultTrackId = target.dataset.trackId
  if (action === 'toggle-reel-defaults') state.reelDefaults = !state.reelDefaults
  if (action === 'toggle-captions') state.captionsHidden = !state.captionsHidden
  if (action === 'set-end-position') state.reelEndPosition = target.dataset.position
  if (action === 'select-slide') state.selectedSlideId = target.dataset.slideId
  if (action === 'set-default-slide') state.defaultSlideId = target.dataset.slideId
  if (action === 'move-slide-up' || action === 'move-slide-down') {
    const currentIndex = state.slides.findIndex((slide) => slide.id === target.dataset.slideId)
    const nextIndex = action === 'move-slide-up' ? currentIndex - 1 : currentIndex + 1
    if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < state.slides.length) {
      reorderSlides(target.dataset.slideId, state.slides[nextIndex].id)
    }
  }
  if (action === 'set-poster-status') {
    state.posterStatus = target.dataset.status
    state.posterText = target.dataset.status
  }
  if (action === 'toggle-poster-video') state.posterVideoEnabled = !state.posterVideoEnabled
  if (action === 'start-recording') {
    startRecording()
    return
  }
  if (action === 'stop-recording') {
    stopRecording()
    return
  }
  if (action === 'clear-recording') {
    clearRecording()
    return
  }
  if (action === 'select-network') state.selectedNetwork = target.dataset.network
  if (action === 'send-selected-output') {
    const job = getJob()
    job.status = state.publishMode === 'auto' ? 'Published' : 'Needs approval'
    job.updated = 'Just now'
  }

  renderApp()
}

function handleInput(event) {
  const target = event.target
  const { input } = target.dataset
  if (!input) return

  if (input === 'slide-caption') getSlide().caption = target.value
  if (input === 'poster-text') state.posterText = target.value
  if (input === 'voice-notes') state.voiceNotes = target.value
  if (input === 'social-template') state.socialTemplates[state.selectedNetwork] = target.value
  if (input === 'field') state.fields[target.dataset.fieldName] = target.value

  syncLiveBindings()
}

function handleChange(event) {
  const target = event.target

  if (target.dataset.upload === 'slides') {
    addSlides(target.files)
    target.value = ''
    return
  }

  if (target.dataset.upload === 'music') {
    addTracks(target.files)
    target.value = ''
    return
  }

  if (target.dataset.upload === 'poster-video') {
    setPosterVideo(target.files[0])
    target.value = ''
  }
}

function clearDragState() {
  app.querySelectorAll('.is-drop-target, .is-dragover, .is-dragging').forEach((node) => {
    node.classList.remove('is-drop-target', 'is-dragover', 'is-dragging')
  })
}

function handleDragStart(event) {
  const row = event.target.closest('[data-slide-row]')
  if (!row) return
  dragSlideId = row.dataset.slideId
  row.classList.add('is-dragging')
  event.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(event) {
  const dropzone = event.target.closest('[data-dropzone]')
  if (dropzone) {
    event.preventDefault()
    dropzone.classList.add('is-dragover')
    return
  }

  const row = event.target.closest('[data-slide-row]')
  if (!row || !dragSlideId || row.dataset.slideId === dragSlideId) return
  event.preventDefault()
  clearDragState()
  row.classList.add('is-drop-target')
}

function handleDrop(event) {
  const dropzone = event.target.closest('[data-dropzone]')
  if (dropzone) {
    event.preventDefault()
    if (dropzone.dataset.dropzone === 'slides') addSlides(event.dataTransfer.files)
    if (dropzone.dataset.dropzone === 'music') addTracks(event.dataTransfer.files)
    if (dropzone.dataset.dropzone === 'poster-video') setPosterVideo(event.dataTransfer.files[0])
    clearDragState()
    return
  }

  const row = event.target.closest('[data-slide-row]')
  if (!row || !dragSlideId) return
  event.preventDefault()
  reorderSlides(dragSlideId, row.dataset.slideId)
  dragSlideId = null
  renderApp()
}

app.addEventListener('click', handleClick)
app.addEventListener('input', handleInput)
app.addEventListener('change', handleChange)
app.addEventListener('dragstart', handleDragStart)
app.addEventListener('dragover', handleDragOver)
app.addEventListener('dragend', clearDragState)
app.addEventListener('drop', handleDrop)

renderApp()
