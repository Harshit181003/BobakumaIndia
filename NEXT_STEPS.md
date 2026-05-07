# What to do next

## Already done (or do first): push code

1. Run **`deploy-agent.ps1`** (install, build, git commit, push).  
   See **`DEPLOY_AGENT_RESULT.txt`** for results.

## Next step: run locally

2. Run **`local-dev.ps1`** from the repo root:

   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
   .\local-dev.ps1
   ```

   It will:

   - Create **`.env`** from **`.env.example`** if missing  
   - Start **MySQL** with `docker compose up -d` (unless you pass **`-SkipDocker`**)  
   - Show the **`mysql ... < database/schema.sql`** and **`seed.sql`** commands  
   - Optionally start **`npm run dev`**

3. In a browser:

   - Storefront: http://localhost:3000  
   - API health: http://localhost:4000/health  

4. Log in as seeded admin (dev only): **`superadmin@bobakuma.local`** / **`password`**

## After local dev works: production (DomainRacer)

5. Follow **[DEPLOYMENT_DOMAINRACER.md](DEPLOYMENT_DOMAINRACER.md)** — two Node apps (frontend + backend), production `.env`, MySQL import, Razorpay webhook URL, SSL.
