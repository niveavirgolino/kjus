#!/bin/bash

set -e

echo "Creating tarball..."
tar -czf /tmp/cnjinova.tar.gz .

scp -i cnjinova.pem /tmp/cnjinova.tar.gz ubuntu@18.229.203.58:/home/ubuntu
rm /tmp/cnjinova.tar.gz
echo "Uploaded tarball to AWS."

now=$(date +'%Y-%m-%d')
echo $now
ssh -i ../Default.pem ubuntu@18.229.203.58 << EOF
  sudo rm -rf cnjinova
  mkdir cnjinova
  mv cnjinova.tar.gz cnjinova
  cd cnjinova
  tar -xzf cnjinova.tar.gz
  rm cnjinova.tar.gz
  ./stop.sh
  echo "HOST_IP=18.229.203.58" > frontend/.env

  docker build -t cnjinova .
  docker run -t -i -p 80:80 -p 3000:3000 -v /home/ubuntu/cnjinova:/code -d --rm cnjinova
  echo "Finished"
  cd ..
EOF

