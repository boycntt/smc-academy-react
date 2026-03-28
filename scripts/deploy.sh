#!/bin/bash
# Smart commit: build + commit + push
# Usage: ./scripts/deploy.sh "commit message"

set -e

MESSAGE="${1:-update: $(date +%H:%M)}"

echo "🔨 Building..."
./scripts/pre-commit.sh

echo ""
echo "📝 Committing: $MESSAGE"
git add -A
git commit -m "$MESSAGE"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployed! Check Render dashboard."
echo "   https://dashboard.render.com"
