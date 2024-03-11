@echo off
REM Создание папки с текущей датой и временем
setlocal
for /f "tokens=1-5 delims=/:. " %%a in ("%DATE% %TIME%") do (
    set "YEAR=%%c"
    set "MONTH=%%b"
    set "DAY=%%a"
    set "HOUR=%%d"
    set "MINUTE=%%e"
)
if "%MONTH:~1,1%"=="/" set MONTH=0%MONTH:~0,1%
if "%DAY:~1,1%"=="/" set DAY=0%DAY:~0,1%
if "%HOUR:~1,1%"==":" set HOUR=0%HOUR:~0,1%
if "%MINUTE:~1,1%"==":" set MINUTE=0%MINUTE:~0,1%
set "DATETIME=%YEAR%-%MONTH%-%DAY%_%HOUR%-%MINUTE%"
set "BACKUP_DIR=D:\ProJecT-WEB\= D i P L o M =\backupDB\%DATETIME%"
mkdir "%BACKUP_DIR%"

SET MONGO_CONTAINER_NAME=diplom-mongodb-1
SET KEYCLOAK_CONTAINER_NAME=diplom-keycloak-1
SET NETWORK_DEFAULT_DOCKER=diplom_default

echo Запускаем контейнеры:
docker start %MONGO_CONTAINER_NAME%
docker start %KEYCLOAK_CONTAINER_NAME%

echo Создание бекапов внутри контейнера...
docker exec %MONGO_CONTAINER_NAME% mongodump --archive=/tmp/%MONGO_CONTAINER_NAME%.gz --gzip
docker cp %MONGO_CONTAINER_NAME%:/tmp/%MONGO_CONTAINER_NAME%.gz "%BACKUP_DIR%/%MONGO_CONTAINER_NAME%.gz"
docker exec %KEYCLOAK_CONTAINER_NAME% mongodump --archive=/tmp/%KEYCLOAK_CONTAINER_NAME%.gz --gzip
docker cp %KEYCLOAK_CONTAINER_NAME%:/tmp/%KEYCLOAK_CONTAINER_NAME%.gz "%BACKUP_DIR%/%KEYCLOAK_CONTAINER_NAME%.gz"

echo Backup process completed.
pause
