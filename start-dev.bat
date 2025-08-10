@echo off
echo Starting LexiQuest Development Environment...
echo.

echo Starting Backend Server...
start "LexiQuest Backend" cmd /k "cd lexi-quest-backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "LexiQuest Frontend" cmd /k "cd lexi-quest-frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul