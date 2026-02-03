@echo off
cd C:\Users\Admin\clawd\clawdbot-render-deploy

echo 🚀 Setting up Clawdbot Agent for Render deployment
echo =================================================

REM Remove existing git if any
if exist .git (
    rmdir /s /q .git
    echo ✅ Removed existing .git directory
)

REM Initialize new git repository
git init
echo ✅ Initialized new git repository

REM Configure git
git config user.name "KwangHuyz"
git config user.email "qhuynd1742002@gmail.com"
echo ✅ Configured git with your info

REM Add all files
git add .
echo ✅ Added all files to git

REM Create initial commit
git commit -m "Initial commit: Clawdbot Agent for Render deployment"
echo ✅ Created initial commit

echo.
echo 🎯 NEXT STEPS - MANUAL GITHUB REPO CREATION:
echo =================================================
echo.
echo 1. Open browser and go to: https://github.com
echo 2. Login with your GitHub account (KwangHuyz)
echo 3. Click "New repository" (green button)
echo 4. Repository name: clawdbot-render-deploy
echo 5. Make it PUBLIC (important for Render)
echo 6. DO NOT initialize with README (we already have files)
echo 7. Click "Create repository"
echo.
echo 8. COPY the commands shown on GitHub page
echo    They will look like:
echo    git remote add origin https://github.com/KwangHuyz/clawdbot-render-deploy.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 9. PASTE those commands in this command prompt and press Enter
echo.
echo 🔔 PRESS ANY KEY when you have created the GitHub repository...
pause > nul

echo.
echo 🚀 Now let's push to GitHub...
echo.

set /p GITHUB_COMMAND="Paste the 'git remote add' command here: "

REM Extract the URL from the command
for /f "tokens=3" %%a in ("%GITHUB_COMMAND%") do set REPO_URL=%%a

REM Remove quotes if present
set REPO_URL=%REPO_URL:"=%

echo 📡 Adding remote origin: %REPO_URL%
%GITHUB_COMMAND%

echo 🌿 Setting branch to main
git branch -M main

echo 📤 Pushing to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    echo.
    echo Possible causes:
    echo   - GitHub repository not created yet
    echo   - Wrong GitHub URL
    echo   - Authentication required
    echo.
    echo Please check:
    echo   1. GitHub repository exists at: https://github.com/KwangHuyz/clawdbot-render-deploy
    echo   2. URL is correct: %REPO_URL%
    echo   3. You are logged in to GitHub
    echo.
    pause
    exit /b 1
)

echo ✅ Successfully pushed to GitHub!
echo.
echo 🎉 GITHUB SETUP COMPLETE!
echo Your code is now at: https://github.com/KwangHuyz/clawdbot-render-deploy
echo.

echo 🚀 RENDER DEPLOYMENT INSTRUCTIONS:
echo =================================================
echo.
echo 1. Go to: https://render.com
echo 2. Sign up (FREE - no credit card required)
echo 3. Click "New +" → "Web Service"
echo 4. Select "Build from your Git repository"
echo 5. Connect to your GitHub account
echo 6. Select repository: KwangHuyz/clawdbot-render-deploy
echo 7. Configure service:
echo    - Name: clawdbot-agent
echo    - Type: Worker Service (important for 24/7)
echo    - Region: Singapore (or nearest to you)
echo    - Runtime: Node
echo    - Build Command: leave default
echo    - Start Command: npm start
echo 8. Add Environment Variables:
echo    - NODE_ENV = production
echo    - GATEWAY_URL = ws://127.0.0.1:18789
echo    - CLAWDBOT_TOKEN = DESKTOP-0JJ8EBR
echo 9. Click "Create Web Service"
echo 10. Wait 2-5 minutes for deployment
echo.
echo ✅ Your Clawdbot agent will run 24/7 on Render!
echo.
echo 🎯 SUMMARY:
echo =================================================
echo ✅ GitHub repository created
echo ✅ Code pushed to GitHub
echo ✅ Ready for Render deployment
echo ✅ 750 hours free per month
echo ✅ 24/7 agent operation
echo.
echo 🚀 DEPLOYMENT STATUS: READY FOR RENDER!
echo.
pause