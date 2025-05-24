#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Setting up Leo Fortune Run dev environment..."

# --- Node.js (via nvm) ---------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "⛔️ Node.js not found. Installing via nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install --lts
fi

# --- pnpm (via Corepack) --------------------------------------------------
if ! command -v pnpm >/dev/null 2>&1; then
  echo "⬇️ Installing pnpm..."
  corepack enable
  corepack prepare pnpm@8.15.5 --activate
fi

# --- Dependencies --------------------------------------------------------
echo "⬇️ Installing project dependencies (pnpm install)..."
pnpm install

echo "✅ Environment ready!  Run 'pnpm dev' to start the dev server."