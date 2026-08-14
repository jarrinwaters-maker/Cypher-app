#!/bin/bash

# Build first
echo "🔨 Building project..."
npm run build

# Ensure main.js exists (create symlink if needed)
if [ -f 'dist/c705-backend/src/main.js' ] && [ ! -f 'dist/main.js' ]; then
  cd dist
  ln -sf c705-backend/src/main.js main.js 2>/dev/null
  ln -sf c705-backend/src/main.js.map main.js.map 2>/dev/null
  cd ..
  echo "✅ Created symlinks"
fi

# Start watch mode in background, monitor and fix
echo "🚀 Starting server in watch mode..."
nest start --watch &
NEST_PID=$!

# Monitor and fix dist structure
while kill -0 $NEST_PID 2>/dev/null; do
  sleep 2
  if [ -f 'dist/c705-backend/src/main.js' ] && [ ! -f 'dist/main.js' ] && [ ! -L 'dist/main.js' ]; then
    cd dist
    ln -sf c705-backend/src/main.js main.js 2>/dev/null
    cd ..
    echo "🔧 Fixed dist structure"
  fi
done

wait $NEST_PID

