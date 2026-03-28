#!/bin/bash
# Pre-commit build check for SMC Academy
# Runs before every git commit to ensure code builds successfully

set -e

echo "🔨 Building SMC Academy before commit..."

# Check if client directory exists
if [ -d "client" ]; then
  echo "📦 Installing client dependencies..."
  cd client
  npm install --silent 2>/dev/null

  echo "🏗️ Building React app..."
  npm run build 2>&1

  if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    cd ..
  else
    echo "❌ Build FAILED — commit aborted!"
    cd ..
    exit 1
  fi
else
  echo "⚠️ No client directory found, skipping build"
fi

# Check server syntax
if [ -f "server/index.js" ]; then
  echo "🔍 Checking server syntax..."
  node --check server/index.js 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ Server syntax OK"
  else
    echo "❌ Server syntax error — commit aborted!"
    exit 1
  fi
fi

echo "🚀 All checks passed — ready to commit!"
