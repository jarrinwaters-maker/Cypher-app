#!/bin/bash

# Auto-fix dist structure and create symlinks
cd "$(dirname "$0")/.."

FIX_SCRIPT="npm run fix:dist"

# Run fix immediately
eval "$FIX_SCRIPT"

# Watch for changes in dist folder and fix
while true; do
  if [ -d 'dist/c705-backend/src' ] && [ ! -f 'dist/main.js' ] && [ ! -L 'dist/main.js' ]; then
    eval "$FIX_SCRIPT"
  fi
  sleep 1
done

