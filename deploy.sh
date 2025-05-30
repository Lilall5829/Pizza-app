#!/bin/bash

# 🚀 Food Ordering App - Quick Deploy Script

echo "🍔 Food Ordering App - Vercel Deploy"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Food Ordering App"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check for changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Changes detected. Committing..."
    git add .
    echo "Enter commit message (or press Enter for default):"
    read commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Update: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    git commit -m "$commit_message"
    echo "✅ Changes committed"
else
    echo "✅ No changes to commit"
fi

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin main

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Import your GitHub repository"
echo "3. Configure environment variables (see DEPLOYMENT_GUIDE.md)"
echo "4. Deploy!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Happy deploying!" 