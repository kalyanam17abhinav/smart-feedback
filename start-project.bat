@echo off
echo ========================================
echo Smart Feedback Project Setup
echo ========================================

echo.
echo [1/4] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [2.5/4] Installing VADER sentiment analysis...
cd server
call npm install vader-sentiment
cd ..

echo.
echo [3/4] Setup complete! Starting the application...
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:3001
echo.

echo [4/4] Starting both frontend and backend...
call npm run start:all