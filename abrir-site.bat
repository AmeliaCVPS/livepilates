@echo off
rem Inicia o servidor local e abre o site no navegador (dois cliques).
cd /d "%~dp0"
set "NODE=node"
where node >nul 2>nul || set "NODE=%USERPROFILE%\tools\node-portable\node.exe"
start "" http://localhost:8000
"%NODE%" servidor.js 8000
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar o servidor. Verifique se o Node.js esta instalado.
  pause
)
