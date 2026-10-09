# DownBoss.in - All-in-One Social Media Downloader (Production-Ready)

**DownBoss.in** is a free, high-performance, all-in-one social media downloader web app for reels, videos, audio, and carousel posts. Built with Next.js (App Router), Tailwind CSS, TypeScript, and a lightweight Python FastAPI streaming service powered by `yt-dlp` and `gallery-dl`.

---

## 🎨 Design System & Tokens (Extracted from UI Reference)

The user interface matches the reference design with high-fidelity aesthetics, modern glassmorphism, responsive cards, and dark/light modes.

### 1. Color Palette Tokens
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **`darkBg`** | `#0B0F17` | Dark mode background |
| **`darkCard`** | `#151C28` | Dark mode card containers and drawers |
| **`darkHover`** | `#1E293B` | Hover states on dark surfaces |
| **`twitter`** | `#1DA1F2` | X (Twitter) badge & hover accent |
| **`instagram`** | `#E1306C` | Instagram badge & hover accent |
| **`facebook`** | `#1877F2` | Facebook badge & hover accent |
| **`tiktok`** | `#00F2FE` | TikTok badge & highlight |
| **`youtube`** | `#FF0000` | YouTube badge & highlight |
| **`pinterest`** | `#BD081C` | Pinterest badge & highlight |
| **`brand-gradient`** | `from-indigo-600 via-purple-600 to-pink-500` | Logo, hero title highlights, primary action buttons |
| **`instagram-gradient`** | `linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)` | Instagram Reel / Carousel tags |

### 2. Typography & Layout
- **Font Family**: `Inter, sans-serif` (Google Font loaded with font display swap)
- **Border Radii**: `rounded-2xl` for cards, modals, and wrappers; `rounded-xl` for inputs, chips, and buttons.
- **Glassmorphism**: `backdrop-blur-md`, `bg-white/80 dark:bg-darkBg/80`, `border-gray-200 dark:border-gray-800`.
- **Breakpoints Tested**: Desktop (`1440px`), Tablet (`768px`), Mobile (`375px`).

---

## 📂 Project Architecture

```
mahendan web project/
├── frontend/                     # Next.js 14 App Router + Tailwind CSS + TypeScript
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Inter font, Dark mode script, SEO Schema)
│   │   ├── page.tsx              # Main Downloader Page
│   │   ├── terms/page.tsx        # Terms of Service
│   │   ├── privacy/page.tsx      # Privacy Policy
│   │   ├── dmca/page.tsx         # DMCA Copyright Notice & Form
│   │   ├── contact/page.tsx      # Contact Us & Support Form
│   │   ├── [slug]/page.tsx       # Dynamic Platform SEO Landing Pages
│   │   ├── sitemap.ts            # Dynamic sitemap.xml generator
│   │   ├── robots.ts             # robots.txt configuration
│   │   ├── api/extract/route.ts  # Bridge to FastAPI backend with smart mock fallback
│   │   └── api/proxy/route.ts    # Direct streaming proxy (Content-Disposition: attachment)
│   ├── components/
│   │   ├── Navbar.tsx            # Header, modals trigger, dark/light toggle
│   │   ├── PlatformTabs.tsx      # All, X/Twitter, Instagram, Facebook + extra chips
│   │   ├── HeroInput.tsx         # Input, clipboard Paste, Fetch button, Sample test links
│   │   ├── MediaResult.tsx       # Progress animation, preview card, quality selector
│   │   ├── CarouselGrid.tsx      # Multi-image/video post grid & JSZip "Download All"
│   │   ├── BatchModal.tsx        # Batch URL drawer (multi-line processing)
│   │   ├── HistoryModal.tsx      # LocalStorage recent downloads modal
│   │   ├── AdPlaceholder.tsx     # Google AdSense ready slots (top, below result, sidebar)
│   │   ├── Features.tsx          # Fast, No Login, HD Audio highlights
│   │   ├── HowItWorks.tsx        # 3-step guide
│   │   ├── FAQ.tsx               # Accordion with JSON-LD schema
│   │   ├── CookieBanner.tsx      # Consent banner & legal disclaimer
│   │   ├── Toast.tsx             # Pop-up notification box
│   │   └── Footer.tsx            # Platform SEO links, legal links & disclaimer
│   ├── lib/
│   │   ├── api.ts                # Downloader helper, JSZip bundler, history storage
│   │   ├── mockData.ts           # Realistic fallback demo database
│   │   ├── platforms.ts          # Supported platforms configuration & URL detector
│   │   ├── seoData.ts            # Platform-specific metadata & FAQs for SEO
│   │   └── types.ts              # TypeScript interfaces
│   ├── tailwind.config.ts        # Custom color tokens & dark mode class config
│   └── package.json
│
├── backend/                      # Python FastAPI Extraction & Streaming Service
│   ├── main.py                   # FastAPI app, TTLCache, SlowAPI rate limiter, Streaming proxy
│   ├── extractor.py              # yt-dlp & gallery-dl metadata extractor
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Production container for Render / Koyeb / HF Spaces
│
├── .env.example                  # Environment variables template
└── README.md                     # Documentation
```

---

## 🚀 Key Features

1. **Auto-Detection & Clipboard Paste**: Paste any link or click "Paste" to auto-detect the platform and format.
2. **Carousel & Album Posts (JSZip)**: Multi-photo or video albums display in a clean grid with individual download buttons and a **"Download All as ZIP"** button packaged client-side.
3. **Direct File Streaming**: Uses a proxy/stream endpoint so files download directly with `Content-Disposition: attachment` rather than opening in a new tab.
4. **Recent Download History**: Saves past downloads to browser `localStorage` (no database or login needed).
5. **Batch Downloader**: Paste multiple URLs line-by-line to queue batch processing.
6. **In-Memory Cache (TTL 10m)**: Avoids repeated network hits for the same media URL.
7. **Rate Limiting (10 req/min/IP)**: Built-in protection against scraping and bot abuse.
8. **SEO & AdSense Ready**: Dedicated landing pages (`/instagram-reel-downloader`, `/tiktok-video-downloader`, etc.), JSON-LD FAQ schema, OpenGraph tags, sitemap.xml, robots.txt, and AdSense placeholder slots.
9. **Consent & Disclaimer**: Built-in cookie consent banner with fair usage disclaimer.

---

## 💻 Local Development Setup

### 1. Run the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Note: The frontend includes a smart fallback engine. It works completely standalone out-of-the-box even without running the Python backend!

### 2. Run the Backend (Python FastAPI)

In a separate terminal:

```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```

The backend starts at [http://localhost:8000](http://localhost:8000).
Interactive Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🌐 100% Free Zero-Cost Deployment

### Deploy Frontend (Vercel - Zero Cost)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repo and set the **Root Directory** to `frontend`.
4. (Optional) Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
5. Click **Deploy**. Vercel provides global CDN, HTTPS, and continuous deployments for free.

*Alternative*: Deploy to **Cloudflare Pages** using the `@cloudflare/next-on-pages` adapter.

---

### Deploy Backend (Koyeb / Render / Hugging Face Spaces - Zero Cost)

#### Option A: Koyeb (Recommended Free Tier)
1. Sign up at [koyeb.com](https://www.koyeb.com).
2. Create a new App -> Choose **GitHub**.
3. Select your repo and set the **Work Directory** to `backend`.
4. Koyeb automatically detects `backend/Dockerfile` and deploys your container with free SSL and global CDN.

#### Option B: Render Free Web Service
1. Sign up at [render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your repository, set the **Root Directory** to `backend`, Environment to `Docker`.
4. Select the **Free** instance plan and click **Create Web Service**.

#### Option C: Hugging Face Spaces (Docker)
1. Create a new Space on [huggingface.co/spaces](https://huggingface.co/spaces) with SDK set to **Docker**.
2. Push the contents of the `backend/` folder to the space repository.
3. Hugging Face runs Docker with free 16GB RAM and no cold sleeps!

---

## 🛡️ Fair Use & Legal Disclaimer

DownBoss.in is designed solely for educational, personal archival, and backup purposes. Download only content that you own or have explicit permission to use. DownBoss.in does not store, host, or re-distribute media files on our servers.
