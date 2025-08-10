@echo off
echo Installing LexiQuest Dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo Node.js and npm are installed
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd lexi-quest-backend
if exist package.json (
    npm install
    if %errorlevel% equ 0 (
        echo Backend dependencies installed successfully
    ) else (
        echo Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend package.json not found
    pause
    exit /b 1
)

cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd lexi-quest-frontend
if exist package.json (
    npm install
    if %errorlevel% equ 0 (
        echo Frontend dependencies installed successfully
    ) else (
        echo Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend package.json not found
    pause
    exit /b 1
)

cd ..

echo.
echo All dependencies installed successfully!
echo You can now run the application using start-dev.bat
echo.
pause