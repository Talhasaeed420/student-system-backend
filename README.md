# Student System – Backend (Node.js + Express + MongoDB)

## Run
1. `npm install`
2. Edit `.env` (set `MONGO_URI`, `DB_NAME`, `JWT_SECRET`, `CORS_ORIGIN`)
3. `npm run dev`   (or `npm start`)

API: http://localhost:5000 — health check: `/health`

## Endpoints
POST /api/auth/login
GET/POST /api/students | GET/PUT/DELETE /api/students/:id | GET /api/students/stats
(all /api/students routes need `Authorization: Bearer <token>`)
r