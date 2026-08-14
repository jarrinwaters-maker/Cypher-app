#!/bin/bash

# Function to fix dist structure
fix_dist() {
  if [ -d 'dist/c705-backend/src' ] && [ ! -f 'dist/main.js' ]; then
    mkdir -p dist-temp
    cp -r dist/c705-backend/src/* dist-temp/ 2>/dev/null
    if [ -d 'dist-temp' ] && [ "$(ls -A dist-temp 2>/dev/null)" ]; then
      rm -rf dist/* dist/.* 2>/dev/null
      mv dist-temp/* dist/ 2>/dev/null
      rmdir dist-temp 2>/dev/null
      echo "✅ Fixed dist structure"
    fi
  fi
}

# Fix initially
fix_dist

# Watch for changes and fix
while true; do
  if [ -d 'dist/c705-backend/src' ] && [ ! -f 'dist/main.js' ]; then
    fix_dist
  fi
  sleep 2
done &

WATCHER_PID=$!

# Start NestJS in watch mode
nest start --watch

# Cleanup on exit
kill $WATCHER_PID 2>/dev/null

