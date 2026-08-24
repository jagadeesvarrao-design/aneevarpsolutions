# 🏛️ Aneevarp Solutions — Parent Holding Company Corporate API Backend

Official backend platform and API engine for **Aneevarp Solutions**, a modern technology parent holding company governing software products including **ZenResume** (`zenresume.online`), **AI Job Search Agent** (`ai-job-search-agent-chi.vercel.app`), and future incubated ventures.

---

## 🌟 Key Features & Corporate Modules

- 🚀 **Venture Portfolio Engine (`/api/v1/ventures`)**: Showcases subsidiary products, stage (LIVE, BETA, INCUBATING), tech stack, metrics, and website links.
- 📰 **Corporate Newsroom & Press API (`/api/v1/press`)**: Handles official press releases, product announcements, media kits, and brand asset access.
- 💼 **Unified Careers Hub (`/api/v1/careers`)**: Aggregates job postings across parent HQ and portfolio companies with instant job application intake.
- 🏛️ **Governance & IR (`/api/v1/governance`)**: Presents corporate vision, mission, executive team profiles, and legal policies (Privacy, AI Ethics, Terms, ESG).
- 📩 **Smart Contact Router (`/api/v1/contact`)**: Multi-channel routing for enterprise partnerships, licensing, press, and investor relations inquiries.
- 📊 **Ecosystem Telemetry API (`/api/v1/metrics`)**: Real-time dynamic aggregator reporting live usage stats (resumes created, jobs indexed, active users).
- 📚 **Interactive Swagger UI (`/docs`)**: Interactive OpenAPI 3.0 specification for rapid frontend and client integration.

---

## 🏗️ Architecture & Tech Stack

- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database & ORM**: Prisma ORM with SQLite (Production-ready for PostgreSQL migration)
- **Validation**: Zod schema validation
- **Documentation**: Swagger UI & `swagger-jsdoc`
- **Testing**: Jest & Supertest

---

## ⚡ Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CORS_ORIGIN="*"
```

### 3. Initialize Database & Seed Corporate Data
```bash
# Push Prisma schema to SQLite database
npm run db:push

# Populate initial ventures, press releases, team, careers & metrics
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:4000`:
- **API Documentation**: [`http://localhost:4000/docs`](http://localhost:4000/docs)
- **Health Check**: [`http://localhost:4000/health`](http://localhost:4000/health)

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🔗 Frontends & Subdomain Integration Guide

To connect parent website frontends or child product dashboards (ZenResume, AI Job Search Agent) to this backend:

### 1. Reporting Live Stats from Products to Parent Corporate Telemetry
Child applications can post live metrics using `POST /api/v1/metrics/sync`:
```json
{
  "ventureSlug": "zenresume",
  "metricKey": "resumes_generated",
  "metricValue": 135000,
  "metricLabel": "Resumes & Documents Built",
  "unit": "documents"
}
```

### 2. Displaying Universal Jobs Board
Fetch all active job openings across the parent ecosystem via `GET /api/v1/careers`.

### 3. Displaying Corporate Press Releases
Fetch newsroom announcements via `GET /api/v1/press`.

---

## 🚀 Production Deployment

### Deploying to Render / Railway / DigitalOcean
1. Set `DATABASE_URL` to a PostgreSQL instance connection string (e.g. Supabase / Neon / Render Postgres).
2. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`.
3. Run `npm run build` and `npm start`.

---

© 2026 **Aneevarp Solutions**. All rights reserved.
