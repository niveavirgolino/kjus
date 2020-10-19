docker build -t cnjinova .
docker run -t -i -p 80:80 -p 3000:3000 --net=host -v /Users/jmfveneroso/Code/cnj_inova_desafio1:/code --rm cnjinova
