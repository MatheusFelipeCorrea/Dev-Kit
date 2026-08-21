@echo off
setlocal EnableExtensions
REM Hyperion launcher (Windows) — Node 20+ if available, else Docker.
REM Usage: bin\hyperion doctor
REM        bin\hyperion --docker project-verify
REM        set HYPERION_USE_DOCKER=1 && bin\hyperion sync

set "ROOT=%~dp0.."
set "IMAGE=hyperion-cli"
if defined HYPERION_DOCKER_IMAGE set "IMAGE=%HYPERION_DOCKER_IMAGE%"

set "USE_DOCKER=%HYPERION_USE_DOCKER%"
set "ARGS="
:parse
if "%~1"=="" goto after_parse
if /I "%~1"=="--docker" (
  set "USE_DOCKER=1"
  shift
  goto parse
)
set "ARGS=%ARGS% %~1"
shift
goto parse
:after_parse

if defined USE_DOCKER goto docker

where node >nul 2>&1
if errorlevel 1 goto try_docker

for /f "delims=" %%v in ('node -p "process.versions.node.split('.')[0]"') do set "NODE_MAJOR=%%v"
if not defined NODE_MAJOR goto try_docker
if %NODE_MAJOR% LSS 20 goto try_docker

node "%ROOT%\scripts\hyperion\cli.mjs" %ARGS%
exit /b %ERRORLEVEL%

:try_docker
echo [Hyperion] Node ^>= 20 not found — trying Docker...
:docker
where docker >nul 2>&1
if errorlevel 1 (
  echo [Hyperion] Need Node.js ^>= 20 or Docker.
  exit /b 1
)

docker image inspect %IMAGE% >nul 2>&1
if errorlevel 1 (
  echo [Hyperion] Building Docker image %IMAGE% ^(one-time^)...
  docker build -t %IMAGE% -f "%ROOT%\Dockerfile" "%ROOT%"
  if errorlevel 1 exit /b 1
)

set "ENVARGS="
if defined GITHUB_TOKEN set "ENVARGS=%ENVARGS% -e GITHUB_TOKEN"
if defined PROJECT_SYNC_TOKEN set "ENVARGS=%ENVARGS% -e PROJECT_SYNC_TOKEN"
if defined GH_TOKEN set "ENVARGS=%ENVARGS% -e GH_TOKEN"

docker run --rm -v "%CD%:/workspace" -w /workspace %ENVARGS% %IMAGE% %ARGS%
exit /b %ERRORLEVEL%
