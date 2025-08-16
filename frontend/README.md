

# FRONTEND README — ResumeAI (React + Vite)

This is the frontend for ResumeAI. Users upload a resume (PDF/DOCX) and paste a job description; the app sends both to the Spring Boot backend and renders a tailored resume that can be copied or downloaded (PDF/DOCX/TXT).

───────────────────────────────────────────────────────────────────────────────
✨ Features
- React + Vite + React Router
- File parsing:
  • PDF → text via pdfjs-dist worker
  • DOCX → text via mammoth
- API call to backend: POST {VITE_API_URL}/api/jobDesc
- Loading states, copy-to-clipboard
- Download tailored resume as real PDF/DOCX/TXT (pdf-lib & docx)
- Clean UI with Tailwind (classes already embedded)

Routes
- /            → Home (hero + feature cards)
- /upload      → Upload page (file + job description, sends to API)
- /result      → Shows generated resume (from localStorage)
- /about       → Static page placeholder

Key Files (src/)
- pages/Upload.jsx    → file handling, PDF/DOCX extraction, POST to API
- pages/Result.jsx    → copy/download; builds PDF/DOCX from plain text
- pages/Home.jsx      → landing
- App.jsx             → routes
- components/Loading.jsx, Header/Footer/etc
- pdfWorker.js        → pdf.js worker wrapper (imported as default class)
- index.css/App.css   → styles

───────────────────────────────────────────────────────────────────────────────
🧱 Tech Stack
- React 18, Vite
- react-router-dom
- pdfjs-dist (with custom worker via workerPort)
- mammoth (DOCX → text)
- pdf-lib (create real PDFs)
- docx (create real DOCX files)
- lucide-react (icons)
- Tailwind classes (no Tailwind build required if already configured)

───────────────────────────────────────────────────────────────────────────────
⚙️ Configuration

1) Environment variables (.env)
Create a .env file at the project root:
  VITE_API_URL=https://<your-backend-hostname>   # e.g. https://resumeapi-xxxx.onrender.com

Notes:
- In development, if your backend runs locally on 8080: VITE_API_URL=http://localhost:8080
- The frontend fetches: `${VITE_API_URL}/api/jobDesc`

2) pdf.js worker setup
Your code uses:
  import * as pdfjsLib from 'pdfjs-dist';
  import pdfWorker from '../pdfWorker';
  pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

Make sure `src/pdfWorker.js` exports a Web Worker instance or a class that constructs one.
Example (Vite-friendly):
  // src/pdfWorker.js
  import PDFWorker from 'pdfjs-dist/build/pdf.worker?worker';
  export default PDFWorker;

If you named/placed it differently, keep imports in Upload.jsx/Result.jsx in sync.

───────────────────────────────────────────────────────────────────────────────
▶️ Run Locally

Prereqs
- Node.js 18+ (or 20+ recommended)
- pnpm/yarn/npm (any is fine)

Install deps
  npm install
  # or: pnpm i  |  yarn

Create .env
  echo "VITE_API_URL=http://localhost:8080" > .env

Start dev server (default http://localhost:5173)
  npm run dev

Build for production
  npm run build
  # Preview the production build locally:
  npm run preview

───────────────────────────────────────────────────────────────────────────────
🔌 API Contract

POST {VITE_API_URL}/api/jobDesc
Headers:
  Content-Type: application/json

Body:
  {
    "jobDescription": "paste job posting text",
    "resumeText": "plain text extracted from PDF/DOCX"
  }

Response:
  200 OK: plain text string (tailored resume)
  4xx/5xx: error text; UI shows alert + stays on /upload

CORS
- Backend must allow the frontend origin. In Spring, @CrossOrigin includes
  http://localhost:5173 and your Render site domain. Update if your frontend URL changes.

───────────────────────────────────────────────────────────────────────────────
🧪 Quick Manual Test Flow

1) Start backend locally on 8080 with a valid OPENAI_API_KEY
2) Start frontend: npm run dev
3) Go to http://localhost:5173/upload
4) Upload a PDF/DOCX resume, paste a job description, click “Generate”
5) You should be redirected to /result with the tailored text filled
6) Try “Copy”, “Download as PDF/DOCX”, and “Download as TXT”

───────────────────────────────────────────────────────────────────────────────
☁️ Deployment

Option A — Render (Static Site)
- Build command:  npm run build
- Publish directory:  dist
- Environment variables: set VITE_API_URL to your backend URL
- Add a health check monitor for the backend if using Render free plan

Option B — Netlify / Vercel
- Build command: npm run build
- Output: dist
- ENV var: VITE_API_URL
- Configure SPA fallback to index.html (Netlify _redirects or Vercel SPA setting)

Option C — Any static host (S3 + CloudFront, Nginx, etc.)
- Serve the built dist/ folder
- Ensure SPA fallback to /index.html
- Ensure backend CORS allows your final domain

───────────────────────────────────────────────────────────────────────────────
🧠 Implementation Notes

Upload.jsx
- Reads file with FileReader
- PDF: pdfjs-dist parses per-page text with getTextContent()
- DOCX: mammoth.extractRawText
- Sends JSON { resumeText, jobDescription } to `${API}/api/jobDesc`
- Uses localStorage.setItem("updatedResume", <string>) on success
- Navigates to /result

Result.jsx
- Reads tailored text from localStorage.getItem("updatedResume")
- Copy button uses navigator.clipboard
- Download buttons call handleDownload("pdf"/"docx"/"txt")
  • PDF: pdf-lib builds a real PDF, line by line
  • DOCX: docx maps each line to a Paragraph

App.jsx
- createBrowserRouter with routes for /, /upload, /result, /about

───────────────────────────────────────────────────────────────────────────────
🛠️ Troubleshooting

Blank PDF after download
- Ensure pdf-lib flow is used (Result.jsx handleDownload). This repo generates true PDF bytes.

DOCX download won’t open
- Ensure docx Packer.toBlob result is used and saved with .docx mime type.

“Failed to generate tailored resume”
- Backend returned a non-OK status. Check browser console & backend logs.
- Verify VITE_API_URL in .env points at the correct backend.
- Ensure backend OPENAI_API_KEY is set and the model name exists.

CORS errors
- Add your frontend origin to Spring @CrossOrigin list and redeploy backend.

404 on refresh (production)
- Configure SPA fallback (all 404s -> /index.html) on your hosting platform.

Worker errors (pdfjs)
- Ensure pdfWorker.js is configured and imported correctly and that Vite recognizes the ?worker import.
- If you see “Attempting to use a worker without setting workerSrc/workerPort”, double-check GlobalWorkerOptions setup.

───────────────────────────────────────────────────────────────────────────────
📦 Scripts (package.json)

  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5173"
  }

───────────────────────────────────────────────────────────────────────────────
📄 License
MIT (or your preferred license).

───────────────────────────────────────────────────────────────────────────────
Credits
- pdf.js (pdfjs-dist), pdf-lib, docx, mammoth, lucide-react
