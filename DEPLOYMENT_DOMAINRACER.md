# DomainRacer deployment (cPanel + Node.js Selector)

This monorepo runs **two Node processes** in production:

1. **Backend API** — Express on port `4000` (or your assigned port)
2. **Frontend** — Next.js on port `3000` (or your assigned port)

You can also place **Nginx/Apache reverse proxy** in front and map:

- `api.yourdomain.com` → backend
- `yourdomain.com` → frontend

## 1) MySQL (cPanel)

1. Create database + user in **MySQL® Databases**.
2. Import schema + seed:

```bash
mysql -u USER -p DBNAME < database/schema.sql
mysql -u USER -p DBNAME < database/seed.sql
```

3. **Change seeded admin passwords** immediately (seed uses dev password `password` for `superadmin@bobakuma.local` and `admin@bobakuma.local`).

## 2) Environment variables

On the server, set (minimum):

**Backend (`backend/`)**

- `NODE_ENV=production`
- `BACKEND_PORT` (internal port from Node app)
- `APP_PUBLIC_URL=https://your-frontend-domain`
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (long random strings)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` (e.g. `https://api.yourdomain.com/api/auth/google/callback`)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Optional SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

**Frontend (`frontend/`)**

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID=...`
- `APP_PUBLIC_URL=https://your-frontend-domain`

## 3) Build & start commands (Node.js App in cPanel)

**Backend**

- Application root: `backend`
- Startup file: `dist/index.js` (after build) **or** use `tsx` only for dev
- NPM install: `npm install`
- Build: `npm run build`
- Run: `npm run start`

**Frontend**

- Application root: `frontend`
- Build: `npm run build`
- Run: `npm run start`

## 4) Razorpay webhook

Add webhook URL in Razorpay dashboard:

`https://api.yourdomain.com/api/webhooks/razorpay`

Use the **raw body** route (already configured in `backend/src/index.ts` **before** `express.json()`).

## 5) SSL

Use **AutoSSL / Let’s Encrypt** in cPanel for both frontend & API hostnames.

## 6) PM2 (optional on VPS-style plans)

If you have SSH + PM2 instead of Node Selector:

```bash
cd backend && npm ci && npm run build && pm2 start dist/index.js --name bobakuma-api
cd ../frontend && npm ci && npm run build && pm2 start npm --name bobakuma-web -- start
```

## 7) Performance notes

- Keep MySQL on the same region/network as the app server when possible.
- Enable gzip/brotli at the reverse proxy.
- Use Razorpay **live** keys only after testing **test** mode end-to-end.
