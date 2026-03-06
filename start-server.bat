@echo off
title Centro de Mando - Servidor
cd /d "%~dp0"

echo ========================================
echo   Centro de Mando - Imascono
echo   Puerto: 9500
echo ========================================
echo.

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    echo.
)

:: Kill any existing process on port 9500
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9500 ^| findstr LISTENING') do (
    echo Cerrando proceso existente en puerto 9500...
    taskkill /F /PID %%a >nul 2>nul
)

echo Iniciando servidor...
echo.
echo Accede a: http://localhost:9500
echo.
echo Presiona Ctrl+C para detener
echo ========================================
echo.

node server/index.js
