#!/bin/sh

set -e

echo "Preparing Capacitor web assets for Xcode Cloud..."

cd "$CI_PRIMARY_REPOSITORY_PATH"

npm ci
npm run ios:build

test -d ios/App/App/public
test -f ios/App/App/config.xml
test -f ios/App/App/capacitor.config.json

echo "Capacitor web assets are ready."
