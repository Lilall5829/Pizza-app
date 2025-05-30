@echo off
REM 🚀 Food Ordering App - Quick Deploy Script (Windows)

echo 🍔 Food Ordering App - Vercel Deploy
echo ==================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git not initialized. Initializing...
    git init
    git add .
    git commit -m "Initial commit: Food Ordering App"
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)

REM Check for changes and commit
echo 📝 Checking for changes...
git add .

set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update: %date% %time%

git commit -m "%commit_message%"
echo ✅ Changes committed

REM Push to remote
echo 🚀 Pushing to remote repository...
git push origin main

echo.
echo 🎯 Next Steps:
echo 1. Go to https://vercel.com/dashboard
echo 2. Import your GitHub repository
echo 3. Configure environment variables (see DEPLOYMENT_GUIDE.md)
echo 4. Deploy!
echo.
echo 📚 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
echo 🎉 Happy deploying!
pause 