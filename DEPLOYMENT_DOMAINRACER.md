# DomainRacer deployment (cPanel + Node.js App)

This project is a **monorepo** with **two Node.js apps** in production:

| App | Folder | Purpose |
|-----|--------|---------|
| **API** | `backend/` | Express + MySQL + Razorpay webhooks |
| **Web** | `frontend/` | Next.js storefront |

Recommended DNS:

- **Website:** `https://yourdomain.com` (or `www.yourdomain.com`) → **frontend**
- **API:** `https://api.yourdomain.com` → **backend**

Create **`api`** as a **subdomain** in cPanel (**Domains → Subdomains**) pointing at the same account (you will map it to the backend Node app URL).

---

## 0) Get the code onto the server

Pick one:

- **cPanel → Git™ Version Control:** clone `https://github.com/Harshit181003/BobakumaIndia.git` into e.g. `~/BobakumaIndia`
- **ZIP:** upload the repo in **File Manager**, extract
- **SSH:** `git clone ...`

Your paths below will look like:  
`/home/USERNAME/BobakumaIndia/backend` and `/home/USERNAME/BobakumaIndia/frontend`

---

## 1) MySQL (cPanel)

1. **MySQL® Databases:** create database + user + **Add User To Database** with **ALL PRIVILEGES**.
2. Note: **host** is usually `localhost` (cPanel shows this on the database page).
3. Import (phpMyAdmin **Import** tab, or SSH):

```bash
mysql -u CPANEL_DB_USER -p CPANEL_DB_NAME < database/schema.sql
mysql -u CPANEL_DB_USER -p CPANEL_DB_NAME < database/seed.sql
```

4. **Production:** change or remove seeded admins (`superadmin@bobakuma.local` / `password`) — use **phpMyAdmin → SQL** to set a new `password_hash` or register a user and promote role.

---

## 2) Environment variables (critical)

### A) Backend Node app — `backend/`

In **Setup Node.js App → Environment variables**, set at least:

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `PORT` | *(often **auto-set** by cPanel; if the UI shows a port, match it or omit `PORT` and use their field)* |
| `APP_PUBLIC_URL` | `https://yourdomain.com` **exact** URL users open in the browser (no trailing slash) |
| `MYSQL_HOST` | `localhost` |
| `MYSQL_PORT` | `3306` |
| `MYSQL_DATABASE` | *(cPanel DB name)* |
| `MYSQL_USER` | *(cPanel DB user)* |
| `MYSQL_PASSWORD` | *(cPanel DB password)* |
| `JWT_ACCESS_SECRET` | long random string (≥16 chars) |
| `JWT_REFRESH_SECRET` | different long random string |
| `GOOGLE_CLIENT_ID` | *(if using Google login)* |
| `GOOGLE_CLIENT_SECRET` | |
| `GOOGLE_CALLBACK_URL` | `https://api.yourdomain.com/api/auth/google/callback` |
| `RAZORPAY_KEY_ID` | *(test or live)* |
| `RAZORPAY_KEY_SECRET` | |
| `RAZORPAY_WEBHOOK_SECRET` | from Razorpay webhook settings |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | *(optional email)* |

Optional:

- `BIND_HOST` — default is `0.0.0.0` in production (listen on all interfaces). Rarely needed to change.

The API loads `.env` from `backend/.env` **or** the monorepo root `.env`. On shared hosting, **using the Node UI environment variables is usually easiest** (still works: they become `process.env`).

### B) Frontend Node app — `frontend/`

**Important:** `NEXT_PUBLIC_*` is baked in at **`next build`**. Set these **before** running `npm run build`:

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `APP_PUBLIC_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.yourdomain.com` **no** `/api` suffix |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | same as Razorpay key id (public) |

If you change `NEXT_PUBLIC_*`, run **`npm run build`** again.

---

## 3) Create **two** Node.js applications (cPanel)

Use **Setup Node.js App** (or **Node.js Selector**) **twice**.

### App 1 — Backend (API)

- **Node version:** current LTS (18+ or 20+)
- **Application root:** `.../BobakumaIndia/backend`
- **Application URL:** your API host, e.g. `api.yourdomain.com` (or the path cPanel assigns)
- **Application startup file:** `dist/index.js` **after** build (see below)

**Deployment commands** (exact order; cPanel often has “Run NPM Install” / “Run JS script” / terminal):

```bash
cd /home/USERNAME/BobakumaIndia/backend
npm ci
npm run build
```

**Start / restart** the app (or use cPanel **Restart**). Startup command is effectively:

```bash
node dist/index.js
```

*(If your panel only runs `npm start`, that is already `node dist/index.js` in `package.json`.)*

**Smoke test:** open `https://api.yourdomain.com/health` — should return JSON `{ "ok": true, ... }`.

### App 2 — Frontend (Next.js)

- **Application root:** `.../BobakumaIndia/frontend`
- **Application URL:** `yourdomain.com` (or `www`)
- Ensure **`NEXT_PUBLIC_*`** and **`APP_PUBLIC_URL`** are set, then:

```bash
cd /home/USERNAME/BobakumaIndia/frontend
npm ci
npm run build
npm run start
```

**Smoke test:** open your site; product pages should load data from the API.

If the panel uses a assigned **PORT** for Node, Next.js will pick up `PORT` when you use `next start` in recent versions; if not, your host’s docs may require a custom **Application startup file** — use their template or:

```bash
npx next start -H 0.0.0.0 -p $PORT
```

(adapt to Windows/host syntax if needed).

---

## 4) Razorpay

1. In Razorpay Dashboard → **Webhooks**, add:

   `https://api.yourdomain.com/api/webhooks/razorpay`

2. Copy the **webhook secret** into `RAZORPAY_WEBHOOK_SECRET`.

3. Use **test keys** until checkout works end-to-end, then switch to **live** keys and update env + rebuild frontend if public keys change.

---

## 5) Google OAuth (optional)

In Google Cloud Console → **Credentials** → OAuth client:

- **Authorized redirect URIs:**  
  `https://api.yourdomain.com/api/auth/google/callback`

Match `GOOGLE_CALLBACK_URL` exactly.

---

## 6) SSL

In cPanel, enable **AutoSSL / Let’s Encrypt** for:

- `yourdomain.com` / `www`
- `api.yourdomain.com`

Use **HTTPS** in all public URLs (`APP_PUBLIC_URL`, `NEXT_PUBLIC_API_BASE_URL`, Razorpay webhook).

---

## 7) Troubleshooting

| Symptom | What to check |
|--------|----------------|
| **CORS errors** in browser | `APP_PUBLIC_URL` must match the **exact** storefront origin (scheme + host, no wrong `www`). |
| **502 / app won’t start** | Wrong **startup file**, forgot `npm run build`, or `PORT` mismatch. Check Node app logs in cPanel. |
| **DB connection errors** | `MYSQL_*` wrong; on cPanel host is usually `localhost`; user must be **assigned** to the database. |
| **Shop loads, no products** | `NEXT_PUBLIC_API_BASE_URL` wrong or API down; test `/health` and `/api/products`. |
| **Webhook not updating orders** | URL must hit **raw** webhook route; secret must match; use **HTTPS**. |

---

## 8) PM2 (only if you have SSH and prefer it)

```bash
cd backend && npm ci && npm run build && pm2 start dist/index.js --name bobakuma-api
cd ../frontend && npm ci && npm run build && pm2 start npm --name bobakuma-web -- start
```

---

## 9) After go-live

- Rotate JWT secrets and admin passwords.
- Remove or restrict seeded demo accounts.
- Monitor Razorpay **test vs live** mode and webhook delivery logs.
