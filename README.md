ResumeAI – Root README (for monorepo shell pointing to separate frontend & backend repos)
======================================================================================

Overview
--------
ResumeAI is a full-stack app that tailors a resume to a given job description using OpenAI.

- Frontend: React + Vite + Tailwind, file upload (PDF/DOCX), JD input, calls backend API.
- Backend: Spring Boot (WebFlux) that sends prompts to OpenAI and returns tailored resume text.


Repo Layout (this repo)
-----------------------
This repo acts as the “root” shell. The actual app lives in TWO separate repositories:

- frontend/  -> clone of the frontend repo
- backend/   ->  empty folder , the backend repo is in a different repo.

Typical tree here:
root/
  frontend/            (cloned from its own repo)
  backend/             (may be empty in this repo – backend is separate)
  README.txt           (this file)


Where to find the code
----------------------
Replace the placeholders below with your real URLs.

Frontend repo (React app):
<FRONTEND_REPO_URL>

Backend repo (Spring Boot API):
<BACKEND_REPO_URL>


Quick Start – Local Development
-------------------------------
Prereqs:
- Node 18+ and npm
- Java 17+
- (Optional) Docker if you want to run via container

1) Clone this root repo (the shell)
   git clone <THIS_ROOT_REPO_URL>
   cd <root>

2) Get the FRONTEND code into ./frontend
   cd frontend
   git clone <FRONTEND_REPO_URL> .
   npm install

   Create ./frontend/.env with:
   VITE_API_URL=http://localhost:8080

3) Get the BACKEND code (run from its own repo, or clone here if you want)
   # Option A: work in a separate folder elsewhere on your disk:
   git clone <BACKEND_REPO_URL> ../resumeapi-backend
   cd ../resumeapi-backend

   # Option B (optional): clone into ./backend in this root
   # cd ../backend
   # git clone <BACKEND_REPO_URL> .

4) Configure backend environment
   export OPENAI_API_KEY="sk-..."   # required

5) Start backend (from backend repo folder)
   ./mvnw spring-boot:run
   # Backend serves on http://localhost:8080
   # Health check: http://localhost:8080/actuator/health

6) Start frontend (from ./frontend)
   npm run dev
   # Frontend at http://localhost:5173


API Contract (Backend)
----------------------
POST /api/jobDesc
Content-Type: application/json

Request body:
{
  "jobDescription": "Paste the JD text...",
  "resumeText": "Paste or extracted resume text..."
}

Response:
200 OK -> returns plain text (rewritten/tailored resume)
400/401/5xx -> error responses (validation, missing OPENAI_API_KEY, upstream errors)

Health:
GET /actuator/health -> {"status":"UP"}


CORS / Frontend URL
-------------------
Backend allows:
- http://localhost:5173 (local dev)
- https://<your-frontend-domain> (production)

If your production frontend domain changes, update @CrossOrigin in ResumeAPIController on the backend.


Environment Variables
---------------------
Frontend (.env):
VITE_API_URL=<backend-base-url>

Backend:
OPENAI_API_KEY=sk-...   (required)
PORT (on Render/hosting) – Spring respects server.port=${PORT:8080}


Build & Run (Production)
------------------------
Frontend:
- Build: npm run build
- Deploy: any static host (Netlify, Vercel, Render static, S3 + CloudFront)
- Ensure VITE_API_URL points to your deployed backend URL before building.

Backend:
- Jar: ./mvnw clean package && java -jar target/resumeAPI-0.0.1-SNAPSHOT.jar
- Docker (example): docker build -t resumeapi . && docker run --rm -p 8080:8080 -e OPENAI_API_KEY="sk-..." resumeapi
- Health check path for hosts: /actuator/health

Render notes (free plan):
- Free instances go idle after ~15 minutes of inactivity.
- Optional: use an uptime monitor to ping /actuator/health every ~5 minutes to keep warm.
- Occasional “DNS resolving” or cold start delays may happen on free tiers.


Troubleshooting
---------------
Frontend shows CORS error:
- Ensure your frontend origin is allowed in @CrossOrigin on backend.
- Confirm VITE_API_URL points to the correct backend URL.

Backend 401 Unauthorized:
- OPENAI_API_KEY not set or invalid. Export it and restart.

404 from frontend API calls:
- Make sure requests hit `${VITE_API_URL}/api/jobDesc` (not just /jobDesc).
- Confirm backend is running and reachable.

Render “Not Found” intermittently:
- Free instance may have gone to sleep; a first request triggers cold start.
- Check Render logs/health; use uptime pings if needed.

PDF/DOCX extraction issues on frontend:
- Ensure pdfjs worker is set via workerPort and mammoth is installed for DOCX.
- Large/complex PDFs may extract imperfectly; try DOCX if possible.


Contributing / Branching (optional)
-----------------------------------
- Keep frontend and backend as separate repos to deploy independently.
- In this root shell, you can use git submodules or keep the backend folder empty.
- PRs go to their respective repos.

-------

