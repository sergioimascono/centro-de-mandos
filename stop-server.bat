@echo off
echo Deteniendo Centro de Mando...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9500 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
    echo Servidor detenido.
    goto :done
)

echo No hay servidor ejecutandose en puerto 9500.

:done
timeout /t 2 >nul
