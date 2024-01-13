FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl 

RUN npm install -g http-server

WORKDIR /home/app

EXPOSE 8080

CMD ["tail","-f","/dev/null"]