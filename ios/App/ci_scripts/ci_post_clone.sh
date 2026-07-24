#!/bin/sh

set -e

echo "Preparing Capacitor web assets for Xcode Cloud..."

cd "$CI_PRIMARY_REPOSITORY_PATH"

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Installing Node.js with Homebrew..."
  brew install node
fi

node --version
npm --version

npm ci
npm run ios:build

test -d ios/App/App/public
test -f ios/App/App/config.xml
test -f ios/App/App/capacitor.config.json

echo "Capacitor web assets are ready."
