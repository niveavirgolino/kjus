#!/bin/bash

# Apply database migrations.
# python manage.py migrate
echo 'Starting server'

HOST_IP=192.168.99.100
# Start webpack server.
# if [[ $DEBUG == *1* ]]; then
cd frontend
npm install
npm run start &
cd ..
# fi

# cd frontend
# npm install
# npm run build
# cd ..

pip install sshtunnel
pip3 install sshtunnel

# Tries to start server 10 times.
COUNT=0
MAX_TRIES=10
while [ $COUNT -lt $MAX_TRIES ]; do
  python3 manage.py runserver 0.0.0.0:80
  if [ $? -eq 0 ];then
    exit 0
  fi
  sleep 10
  let COUNT=COUNT+1
done

echo "Server start failed too many times."
exit 1
