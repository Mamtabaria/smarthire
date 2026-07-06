# smartHire

AI-powered internship platform for students and recruiters.  
Students can analyze resumes, get ATS scores, identify skill gaps, and track applications.  
Clients can post jobs, review applicants, shortlist/reject candidates, and manage hiring workflows.

## Features

- Resume upload and ATS analysis
- Skill gap detection and AI learning roadmap
- AI chat assistant for career doubts
- Job posting and application management
- Role-based dashboards (`user` and `client`)
- Mobile-responsive UI with scroll reveal animations

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT
- **AI:** OpenRouter (assistant + roadmap)
- **External APIs:** Arbeitnow job board, RapidAPI resume rating

## Project Structure

```text
smartHire/
  frontend/   # React app (Vite)
  backend/    # Express API
```

## Local Development

### 1) Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as template.

Required:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (comma-separated allowed origins, e.g. frontend URL + localhost)
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_ASSISTANT_MODEL`
- `OPENROUTER_FALLBACK_MODEL`
- `RAPIDAPI_HOST`
- `RAPIDAPI_KEY`

### Frontend (`frontend/.env`)

Use `frontend/.env.example` as template.

Required:

- `VITE_API_URL` (e.g. `https://<your-backend>.onrender.com/api`)

## Render Deployment (Separate Frontend + Backend URLs)

### Backend Web Service

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- Add all backend env vars from `.env.example`
- Set `CLIENT_URL` to your frontend Render URL (and optionally localhost)

Example:

```text
CLIENT_URL=https://your-frontend.onrender.com,http://localhost:5173
```

### Frontend Static Site

- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- Env var:
  - `VITE_API_URL=https://your-backend.onrender.com/api`

### After Deploy

1. Update backend `CLIENT_URL` with your real frontend URL.
2. Redeploy backend service.
3. Verify:
   - login/signup
   - job apply flow
   - client applicants
   - resume analysis + ATS
   - roadmap + assistant

## Production Validation Done

- Frontend production build passes: `npm run build`
- Backend syntax checks pass for critical files

## Notes

- Uploaded application resumes are stored in MongoDB and can be opened by authorized user/client.
- WhatsApp bulk messaging is currently shown as a future enhancement message in client applicants UI.

---

Built with care for responsive usage and practical hiring workflows.
