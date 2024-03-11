@echo off
SET MONGO_CONTAINER_NAME=diplom-mongodb-1
SET BACKUP_PATH=E:\DoWNLoaD

echo Запускаем контейнеры:
docker start %MONGO_CONTAINER_NAME%

echo Копируем и восстанавливаем БД MongoDB...
docker cp %BACKUP_PATH%\%MONGO_CONTAINER_NAME%.gz %MONGO_CONTAINER_NAME%:/tmp
docker exec %MONGO_CONTAINER_NAME% mongorestore --archive=/tmp/%MONGO_CONTAINER_NAME%.gz --gzip --drop

echo Restore process completed.
pause

docker cp E:\DoWNLoaD\diplom-mongodb-1.gz diplom-mongodb-1:/tmp
docker exec diplom-mongodb-1 mongorestore --archive=/tmp/diplom-mongodb-1.gz --gzip --drop