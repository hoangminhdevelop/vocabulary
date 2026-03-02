#!/bin/sh

# Ensure node_modules exists and is up to date
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.installed" ]; then
  echo "📦 Installing dependencies..."
  npm install
  touch node_modules/.installed
else
  echo "✅ Dependencies already installed"
fi

# Execute the main command
exec "$@"
