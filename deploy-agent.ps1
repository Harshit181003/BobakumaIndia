# Bobakuma — one-shot: npm install, build, git commit, push.
# Run in PowerShell: Set-ExecutionPolicy -Scope Process Bypass; .\deploy-agent.ps1
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
$result = Join-Path $root 'DEPLOY_AGENT_RESULT.txt'

function W([string]$text) { Add-Content -LiteralPath $result -Encoding utf8 -Value $text }

Remove-Item -LiteralPath $result -ErrorAction SilentlyContinue
W "DEPLOY_AGENT_RESULT - $(Get-Date -Format o)"
W ""

Set-Location -LiteralPath $root

W "=== npm install ==="
$logInstall = Join-Path $root 'npm-install-full.log'
npm install *>&1 | Tee-Object -FilePath $logInstall
W "npm_install_exit: $LASTEXITCODE"
Get-Content -LiteralPath $logInstall -Tail 40 -ErrorAction SilentlyContinue | ForEach-Object { W $_ }

W ""
W "=== backend build ==="
$logBe = Join-Path $root 'build-backend-full.log'
npm run build -w backend *>&1 | Tee-Object -FilePath $logBe
W "backend_build_exit: $LASTEXITCODE"
Get-Content -LiteralPath $logBe -Tail 60 -ErrorAction SilentlyContinue | ForEach-Object { W $_ }

W ""
W "=== frontend build ==="
$logFe = Join-Path $root 'build-frontend-full.log'
npm run build -w frontend *>&1 | Tee-Object -FilePath $logFe
W "frontend_build_exit: $LASTEXITCODE"
Get-Content -LiteralPath $logFe -Tail 60 -ErrorAction SilentlyContinue | ForEach-Object { W $_ }

W ""
W "=== git ==="
if (-not (Test-Path -LiteralPath (Join-Path $root '.git'))) {
  git init -b main 2>&1 | ForEach-Object { W $_ }
}
git add -A
git status --short 2>&1 | Select-Object -First 40 | ForEach-Object { W $_ }
git commit -m "feat: Bobakuma India e-commerce monorepo" 2>&1 | ForEach-Object { W $_ }
W "git_commit_exit: $LASTEXITCODE"

git remote get-url origin 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  git remote add origin https://github.com/Harshit181003/BobakumaIndia.git 2>&1 | ForEach-Object { W $_ }
}

W ""
W "=== git push ==="
git push -u origin main 2>&1 | ForEach-Object { W $_ }
W "git_push_exit: $LASTEXITCODE"
W "=== END ==="
