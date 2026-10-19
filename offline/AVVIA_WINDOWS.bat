@echo off
setlocal
cd /d "%~dp0"
if not exist "sito\index.html" (
 echo Estrai tutto il file ZIP prima di avviare MATITA.
 pause
 exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0avvia_windows.ps1"
if errorlevel 1 pause
