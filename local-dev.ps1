# Next step after deploy-agent: prepare .env, start MySQL, print DB import commands, start dev servers.
# Run: Set-ExecutionPolicy -Scope Process Bypass; .\local-dev.ps1
# Optional: .\local-dev.ps1 -SkipDocker  (if you use another MySQL)
param([switch]$SkipDocker)

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
Set-Location -LiteralPath $root

Write-Host "=== Bobakuma — local dev (next step) ===" -ForegroundColor Cyan

$envFile = Join-Path $root ".env"
$example = Join-Path $root ".env.example"
if (-not (Test-Path -LiteralPath $envFile) -and (Test-Path -LiteralPath $example)) {
  Copy-Item -LiteralPath $example -Destination $envFile
  Write-Host "Created .env from .env.example — edit JWT secrets and Razorpay keys before production." -ForegroundColor Yellow
} elseif (-not (Test-Path -LiteralPath $envFile)) {
  Write-Host "No .env.example found; create .env manually." -ForegroundColor Yellow
} else {
  Write-Host ".env already exists." -ForegroundColor Green
}

if (-not $SkipDocker) {
  Write-Host "`nStarting MySQL (docker compose)..." -ForegroundColor Cyan
  docker compose up -d
  if ($LASTEXITCODE -ne 0) {
    Write-Host "docker compose failed — install Docker Desktop or use -SkipDocker with your own MySQL." -ForegroundColor Red
  }
}

Write-Host @"

=== Import database (run once, after MySQL is up) ===
Adjust user/password/db if you changed docker-compose.yml.

  mysql -h 127.0.0.1 -P 3306 -u bobakuma_user -pbobakuma_password bobakuma < database/schema.sql
  mysql -h 127.0.0.1 -P 3306 -u bobakuma_user -pbobakuma_password bobakuma < database/seed.sql

Dev admin login (from seed): superadmin@bobakuma.local / password

=== Start apps ===
  npm run dev

Frontend: http://localhost:3000
API:      http://localhost:4000/api
Health:   http://localhost:4000/health

"@ -ForegroundColor White

$run = Read-Host "Start npm run dev now? (y/N)"
if ($run -eq 'y' -or $run -eq 'Y') {
  npm run dev
}
