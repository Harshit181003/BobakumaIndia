# Bobakuma India — Lunchbox E‑Commerce

Production-ready full-stack e‑commerce for lunchboxes with a cute, premium pastel UI.

## Tech
- Frontend: Next.js (React) + Tailwind + Framer Motion
- Backend: Node.js + Express
- DB: MySQL 8
- Auth: JWT + Google Login + Email/Password
- Payments: Razorpay

## Monorepo
- `frontend/` Next.js app
- `backend/` Express API
- `database/` MySQL schema + seeds

## Local setup
1. Copy env:

```bash
cp .env.example .env
```

2. Start MySQL (optional but recommended):

```bash
docker compose up -d
```

3. Import database:

```bash
mysql -h 127.0.0.1 -u bobakuma_user -pbobakuma_password bobakuma < database/schema.sql
mysql -h 127.0.0.1 -u bobakuma_user -pbobakuma_password bobakuma < database/seed.sql
```

4. Install deps:

```bash
npm install
```

5. Run dev servers:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

### Seeded admin (development)
- `superadmin@bobakuma.local` / `password`
- `admin@bobakuma.local` / `password`

**Change these before production.**

## Deployment (DomainRacer cPanel Node.js App)
See [DEPLOYMENT_DOMAINRACER.md](DEPLOYMENT_DOMAINRACER.md).

## GitHub
```bash
git remote add origin https://github.com/Harshit181003/BobakumaIndia.git
git push -u origin main
```

### One-shot install, build, commit, push (Windows)
From the repo root in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\deploy-agent.ps1
```

Summary is written to `DEPLOY_AGENT_RESULT.txt` (and full logs to `*-full.log`).

### Next step: run locally
After the repo is on GitHub and builds are green:

```powershell
.\local-dev.ps1
```

See **[NEXT_STEPS.md](NEXT_STEPS.md)** for the full sequence (local → DomainRacer).

## API: refresh token
`POST /api/auth/refresh` with JSON `{ "refreshToken": "..." }` returns new access + refresh JWTs.
