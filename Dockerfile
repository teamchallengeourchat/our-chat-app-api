FROM node:18.18

ENV MONGO_DB_USERNAME=admin \
  MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY . /home/app

CMD ["node", "/home/app/src/server.js"]

