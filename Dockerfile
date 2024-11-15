FROM node:22.11-alpine3.20

EXPOSE 4000

WORKDIR /usr/app/server

COPY package.json .

COPY . .

CMD ["sh"]

