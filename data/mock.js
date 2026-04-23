// 4reels — mock data
const MOCK = {
  agency: { name: "CKP Estate Agents", tenantId: "ck-2401", plan: "Growth", logo: "assets/ck-logo.png", color: "#d1318a" },

  socials: [
    { id: "instagram", name: "Instagram Reels", icon: "instagram", color: "#E1306C", connected: true, handle: "@ckpestateagents" },
    { id: "tiktok", name: "TikTok", icon: "tiktok", color: "#111111", connected: true, handle: "@ckpestateagents" },
    { id: "youtube", name: "YouTube Shorts", icon: "youtube", color: "#FF0033", connected: true, handle: "CKP Estate Agents" },
    { id: "facebook", name: "Facebook Reels", icon: "facebook", color: "#1877F2", connected: true, handle: "CKP Estate Agents" },
    { id: "linkedin", name: "LinkedIn", icon: "linkedin", color: "#0A66C2", connected: false, handle: null },
    { id: "gmb", name: "Google Business", icon: "google-business", color: "#4285F4", connected: true, handle: "CKP Estate Agents — Dublin" },
  ],

  reels: [
    { id: "r_8832", title: "2-bed apt · Cranford Court", address: "Cranford Court, Stillorgan Road, Dublin 4", price: "€385,000", status: "ready", publishStatus: "needs-approval", cover: "cranford-primary", createdAt: "Apr 22, 2026 · 09:14", duration: "0:36", scenes: 8, music: "Sunlit Rooms", kind: "for-sale", type: "family", networks: ["instagram","tiktok","youtube","facebook"], tracker: { views: 1842, clicks: 23, ctr: 1.2, topNet: "instagram", clicks7d: [1,2,2,4,4,4,6], clicks30d: [0,0,1,1,1,1,1,2,1,2,1,1,2,2,2,2,2,2,3,2,3,2,3,2,3,3,3,3,3,4] } },
    { id: "r_8831", title: "Luxury penthouse · Docklands", address: "Unit 22, Grand Canal Quay, Dublin 2", price: "€1,450,000", status: "ready", publishStatus: "published", cover: "docklands", createdAt: "Apr 22, 2026 · 08:02", duration: "0:42", scenes: 10, music: "Skyline Drift", kind: "for-sale", type: "luxury", networks: ["instagram","tiktok","youtube","facebook","gmb"], tracker: { views: 24180, clicks: 412, ctr: 1.7, topNet: "instagram", clicks7d: [17,57,81,92,92,54,19], clicks30d: [9,21,23,27,28,34,36,44,49,50,52,49,50,55,60,52,57,54,48,52,45,44,45,40,34,30,22,23,13,8] } },
    { id: "r_8830", title: "2-bed apt · Stoneybatter", address: "4A Manor St, Stoneybatter, Dublin 7", price: "€2,350 /mo", status: "ready", publishStatus: "needs-approval", cover: "stoneybatter", createdAt: "Apr 22, 2026 · 07:45", duration: "0:28", scenes: 6, music: "Daylight Loop", kind: "to-let", type: "family", networks: ["instagram","tiktok"], tracker: { views: 6920, clicks: 148, ctr: 2.1, topNet: "tiktok", clicks7d: [5,9,20,20,27,29,38], clicks30d: [2,5,4,6,4,6,8,7,8,9,8,8,10,11,11,11,10,12,12,12,15,14,14,14,17,17,16,17,20,18] } },
    { id: "r_8829", title: "4-bed detached · Dalkey", address: "Sorrento Road, Dalkey, Co. Dublin", price: "€2,200,000", status: "ready", publishStatus: "rejected", cover: "dalkey", createdAt: "Apr 22, 2026 · 07:12", duration: "0:40", scenes: 12, music: "Skyline Drift", kind: "for-sale", type: "luxury", networks: [], tracker: null },
    { id: "r_8828", title: "Studio · Temple Bar", address: "Fleet St, Temple Bar, Dublin 2", price: "€1,650 /mo", status: "ready", publishStatus: "published", cover: "templebar", createdAt: "Apr 21, 2026 · 18:22", duration: "0:24", scenes: 5, music: "City Pulse", kind: "to-let", type: "rental", networks: ["instagram","tiktok","facebook"], tracker: { views: 8432, clicks: 196, ctr: 2.3, topNet: "tiktok", clicks7d: [27,33,28,32,29,26,21], clicks30d: [18,18,15,17,16,20,23,17,17,20,18,17,22,22,15,15,15,15,20,18,21,23,17,18,18,17,20,19,20,18] } },
    { id: "r_8827", title: "3-bed terrace · Phibsborough", address: "Connaught St, Phibsborough, Dublin 7", price: "Sale Agreed", status: "ready", publishStatus: "published", cover: "phibsborough", createdAt: "Apr 21, 2026 · 14:05", duration: "0:38", scenes: 8, music: "Warm Oak", kind: "sale-agreed", type: "family", networks: ["instagram","facebook","gmb"], tracker: { views: 11204, clicks: 87, ctr: 0.8, topNet: "facebook", clicks7d: [20,19,15,11,10,7,5], clicks30d: [10,10,10,10,9,9,9,8,7,8,7,7,7,6,7,6,6,7,6,4,4,4,5,3,4,4,4,3,3,4] } },
    { id: "r_8826", title: "5-bed · Howth sea view", address: "Balscadden Rd, Howth, Co. Dublin", price: "€3,100,000", status: "ready", publishStatus: "needs-approval", cover: "howth", createdAt: "Apr 21, 2026 · 11:30", duration: "0:48", scenes: 14, music: "Ocean Minor", kind: "for-sale", type: "luxury", networks: ["instagram","tiktok","youtube","facebook","linkedin"], tracker: null },
    { id: "r_8825", title: "1-bed · Smithfield", address: "Smithfield Market, Dublin 7", price: "Let Agreed", status: "ready", publishStatus: "published", cover: "smithfield", createdAt: "Apr 21, 2026 · 09:48", duration: "0:22", scenes: 5, music: "Daylight Loop", kind: "let-agreed", type: "rental", networks: ["instagram"], tracker: { views: 2104, clicks: 38, ctr: 1.8, topNet: "instagram", clicks7d: [9,7,7,5,4,3,3], clicks30d: [6,6,5,6,5,5,5,5,5,4,4,4,4,4,3,4,3,3,3,3,2,3,3,2,2,2,1,2,1,1] } },
    { id: "r_8824", title: "3-bed bungalow · Malahide", address: "Seabury Dr, Malahide, Co. Dublin", price: "SOLD", status: "ready", publishStatus: "published", cover: "malahide", createdAt: "Apr 20, 2026 · 16:10", duration: "0:34", scenes: 7, music: "Warm Oak", kind: "sold", type: "family", networks: ["instagram","facebook","gmb"], tracker: { views: 16340, clicks: 271, ctr: 1.7, topNet: "facebook", clicks7d: [14,34,58,64,53,39,9], clicks30d: [6,10,9,11,18,20,17,23,23,25,27,26,26,27,30,27,30,27,26,27,25,24,21,21,19,15,12,8,11,5] } },
    { id: "r_8823", title: "Commercial unit · IFSC", address: "Mayor St Lower, IFSC, Dublin 1", price: "€4,500 /mo", status: "ready", publishStatus: "rejected", cover: "ifsc", createdAt: "Apr 20, 2026 · 13:25", duration: "0:30", scenes: 6, music: "City Pulse", kind: "to-let", type: "rental", networks: [], tracker: null },
  ],

  tracks: [
    { id: "t1", title: "Sunlit Rooms", artist: "In-house", bpm: 92, duration: "1:48", mood: ["warm","acoustic"], propertyTypes: ["family","rental"], statuses: ["for-sale","to-let"], favorite: true, waveform: [0.2,0.4,0.3,0.6,0.8,0.5,0.7,0.9,0.6,0.4,0.5,0.7,0.8,0.6,0.3,0.5,0.7,0.4,0.6,0.8,0.5,0.3,0.4,0.6] },
    { id: "t2", title: "Skyline Drift", artist: "Moor & Finch", bpm: 108, duration: "2:12", mood: ["luxurious","cinematic"], propertyTypes: ["luxury"], statuses: ["for-sale"], favorite: true, waveform: [0.1,0.2,0.3,0.5,0.7,0.9,0.8,0.6,0.4,0.5,0.7,0.9,1.0,0.8,0.6,0.4,0.2,0.3,0.5,0.7,0.8,0.6,0.4,0.2] },
    { id: "t3", title: "Daylight Loop", artist: "Unsigned", bpm: 118, duration: "1:32", mood: ["energetic","modern"], propertyTypes: ["rental","family"], statuses: ["to-let","let-agreed"], favorite: true, waveform: [0.5,0.7,0.6,0.8,0.9,0.7,0.5,0.6,0.8,1.0,0.8,0.6,0.5,0.7,0.9,0.8,0.6,0.4,0.6,0.8,0.9,0.7,0.5,0.6] },
    { id: "t4", title: "Warm Oak", artist: "Pine Hollow", bpm: 88, duration: "1:58", mood: ["warm","relaxed"], propertyTypes: ["family"], statuses: ["for-sale","sold","sale-agreed"], favorite: true, waveform: [0.3,0.4,0.5,0.4,0.5,0.6,0.5,0.6,0.7,0.6,0.5,0.6,0.7,0.8,0.7,0.6,0.5,0.4,0.5,0.6,0.5,0.4,0.3,0.4] },
    { id: "t5", title: "City Pulse", artist: "Ember Club", bpm: 124, duration: "2:04", mood: ["energetic","modern"], propertyTypes: ["rental"], statuses: ["to-let"], favorite: false, waveform: [0.2,0.4,0.7,0.9,0.8,0.6,0.4,0.7,0.9,1.0,0.8,0.6,0.7,0.9,1.0,0.8,0.6,0.4,0.6,0.8,0.9,0.7,0.5,0.3] },
    { id: "t6", title: "Ocean Minor", artist: "Coastal Lines", bpm: 96, duration: "2:20", mood: ["cinematic","luxurious"], propertyTypes: ["luxury"], statuses: ["for-sale"], favorite: true, waveform: [0.1,0.2,0.4,0.5,0.7,0.8,0.9,0.8,0.7,0.5,0.6,0.8,0.9,1.0,0.9,0.7,0.5,0.4,0.6,0.8,0.7,0.5,0.3,0.2] },
    { id: "t7", title: "Slate Morning", artist: "Near & Far", bpm: 100, duration: "1:44", mood: ["modern","minimal"], propertyTypes: ["family","luxury"], statuses: ["for-sale"], favorite: false, waveform: [0.4,0.5,0.4,0.5,0.6,0.5,0.4,0.5,0.6,0.7,0.6,0.5,0.4,0.5,0.6,0.7,0.6,0.5,0.4,0.5,0.6,0.5,0.4,0.5] },
    { id: "t8", title: "Linen Breeze", artist: "In-house", bpm: 86, duration: "1:50", mood: ["relaxed","warm"], propertyTypes: ["rental","family"], statuses: ["to-let","let-agreed"], favorite: false, waveform: [0.3,0.4,0.3,0.4,0.5,0.4,0.3,0.4,0.5,0.4,0.3,0.4,0.5,0.4,0.5,0.6,0.5,0.4,0.3,0.4,0.3,0.4,0.5,0.4] },
    { id: "t9", title: "Golden Hour", artist: "Pine Hollow", bpm: 104, duration: "2:02", mood: ["warm","cinematic"], propertyTypes: ["luxury","family"], statuses: ["for-sale","sold"], favorite: true, waveform: [0.2,0.3,0.5,0.6,0.7,0.8,0.9,0.8,0.6,0.5,0.7,0.8,0.9,0.8,0.7,0.6,0.5,0.7,0.8,0.6,0.5,0.4,0.3,0.2] },
  ],

  // Description template blocks per network
  defaultBlocks: [
    { id: "b1", type: "title", label: "Title", content: "{{property_title}}" },
    { id: "b2", type: "emoji", label: "Emoji line", content: "📍 {{city}}" },
    { id: "b3", type: "price", label: "Price", content: "💰 {{price}}" },
    { id: "b4", type: "features", label: "Features", content: "🛏 {{bedrooms}} · 🛁 {{bathrooms}} · 📐 {{size_m2}} m²" },
    { id: "b5", type: "text", label: "Description", content: "{{short_description}}" },
    { id: "b6", type: "cta", label: "CTA", content: "👉 Book a viewing: {{booking_link}}" },
    { id: "b7", type: "hashtags", label: "Hashtags", content: "#dublinhomes #realestate #{{neighborhood_tag}} #propertytour #reels" },
  ],

  variables: [
    { key: "property_title", sample: "2-bed apt · Cranford Court" },
    { key: "city", sample: "Dublin 4" },
    { key: "neighborhood", sample: "Stillorgan" },
    { key: "neighborhood_tag", sample: "stillorgan" },
    { key: "price", sample: "€385,000" },
    { key: "bedrooms", sample: "2" },
    { key: "bathrooms", sample: "1" },
    { key: "size_m2", sample: "68" },
    { key: "short_description", sample: "Bright 2-bed apartment in a sought-after private development with mature gardens." },
    { key: "booking_link", sample: "ckpestateagents.ie/view/r8832" },
    { key: "agent_name", sample: "Marvin Farrell" },
    { key: "agent_phone", sample: "085 118 5832" },
  ],

  // Super-admin
  tenants: [
    { id: "hv-2401", name: "Harbor & Vale Realty", plan: "Growth", seats: 8, reelsMonth: 142, storageGb: 18.4, mrr: 189, status: "active", joined: "Jan 2026" },
    { id: "om-2211", name: "O'Malley Property Group", plan: "Scale", seats: 22, reelsMonth: 384, storageGb: 54.1, mrr: 449, status: "active", joined: "Nov 2025" },
    { id: "br-2507", name: "Bishop & Rowe", plan: "Starter", seats: 3, reelsMonth: 28, storageGb: 4.2, mrr: 69, status: "trial", joined: "Apr 2026" },
    { id: "co-2302", name: "Coast & Quay Estates", plan: "Growth", seats: 11, reelsMonth: 201, storageGb: 26.7, mrr: 189, status: "active", joined: "Feb 2026" },
    { id: "gl-2410", name: "Glendale Living", plan: "Starter", seats: 2, reelsMonth: 11, storageGb: 1.8, mrr: 69, status: "paused", joined: "Mar 2026" },
    { id: "ke-2112", name: "Keane Residential", plan: "Scale", seats: 31, reelsMonth: 612, storageGb: 82.3, mrr: 449, status: "active", joined: "Oct 2025" },
  ],

  team: [
    { id: "u1", name: "Marvin Farrell", email: "marvin@ckpestateagents.ie", role: "Admin", status: "active", twoFA: true, sso: true, lastSeen: "2 min ago", avatarHue: 215, joined: "Jan 2026" },
    { id: "u2", name: "Aoife Byrne", email: "aoife@ckpestateagents.ie", role: "Editor", status: "active", twoFA: true, sso: true, lastSeen: "14 min ago", avatarHue: 330, joined: "Jan 2026" },
    { id: "u3", name: "Cillian Walsh", email: "cillian@ckpestateagents.ie", role: "Editor", status: "active", twoFA: false, sso: true, lastSeen: "1 hr ago", avatarHue: 145, joined: "Feb 2026" },
    { id: "u4", name: "Sinead O'Connor", email: "sinead@ckpestateagents.ie", role: "Viewer", status: "active", twoFA: true, sso: true, lastSeen: "yesterday", avatarHue: 45, joined: "Feb 2026" },
    { id: "u5", name: "Darragh Murphy", email: "darragh@ckpestateagents.ie", role: "Editor", status: "invited", twoFA: false, sso: false, lastSeen: "—", avatarHue: 260, joined: "Pending" },
    { id: "u6", name: "Listings team", email: "listings@ckpestateagents.ie", role: "Viewer", status: "active", twoFA: false, sso: true, lastSeen: "3 days ago", avatarHue: 190, joined: "Mar 2026" },
  ],

  roles: [
    { id: "Admin", label: "Admin", desc: "Full access to everything, including billing and team.", perms: { reels: "rw", publish: "rw", music: "rw", brand: "rw", automation: "rw", admin: "rw", api: "rw" } },
    { id: "Editor", label: "Editor", desc: "Can create, edit and publish reels. Cannot change team or API settings.", perms: { reels: "rw", publish: "rw", music: "rw", brand: "rw", automation: "ro", admin: "none", api: "none" } },
    { id: "Viewer", label: "Viewer", desc: "Read-only across the app. Good for execs or external stakeholders.", perms: { reels: "ro", publish: "none", music: "ro", brand: "ro", automation: "ro", admin: "none", api: "none" } },
  ],
};

window.MOCK = MOCK;
