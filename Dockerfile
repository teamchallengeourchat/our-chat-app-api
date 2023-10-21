FROM node:18.18

ENV MONGO_DB_USERNAME=admin \
  MONGO_DB_PWD=password

RUN mkdir -p ./app

COPY . /app

CMD ["node", "./app/src/server.js"]

