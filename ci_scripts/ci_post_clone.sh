#!/bin/sh

set -e

cd "$CI_WORKSPACE"

npm ci
npm run ios:build
