@echo off
echo Starting Expense Tracker (Single Port)...
echo Open your browser to: http://localhost:5000

cd backend
"C:\Program Files\nodejs\node.exe" server.js || pause
