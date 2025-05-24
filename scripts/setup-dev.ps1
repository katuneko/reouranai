Write-Host "🔧 Setting up Leo Fortune Run dev environment..." -ForegroundColor Cyan

# --- Node.js ------------------------------------------------------------
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "⛔ Node.js not found. Downloading LTS..." -ForegroundColor Yellow
  $installer = "$env:TEMP
ode-lts.msi"
  Invoke-WebRequest -Uri "https://nodejs.org/dist/v22.1.0/node-v22.1.0-x64.msi" -OutFile $installer
  Start-Process msiexec.exe -Wait -ArgumentList '/i', $installer, '/qn', '/norestart'
}

# --- pnpm (via Corepack) ------------------------------------------------
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "⬇ Installing pnpm..." -ForegroundColor Yellow
  corepack enable
  corepack prepare pnpm@latest --activate
}

# --- Dependencies -------------------------------------------------------
Write-Host "⬇ Installing project dependencies (pnpm install)..." -ForegroundColor Yellow
pnpm install

Write-Host "✅ Environment ready!  Run 'pnpm dev' to start the dev server." -ForegroundColor Green