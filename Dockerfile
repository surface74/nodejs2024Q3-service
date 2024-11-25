FROM node:22.11-alpine3.20

EXPOSE 4000

WORKDIR /usr/app/server

COPY package.json package.json

RUN npm i --omit=dev --force && npm prune --omit=dev

COPY dist dist

CMD ["node", "dist/main"]

