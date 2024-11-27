FROM node:22.11-alpine3.20 AS base
WORKDIR /usr/app/server
COPY package.json package.json
RUN npm i --omit=dev --force
COPY dist dist

FROM node:22.11-alpine3.20
WORKDIR /usr/app/server
COPY --from=base /usr/app/server /usr/app/server
EXPOSE 4000

CMD ["node", "dist/main"]