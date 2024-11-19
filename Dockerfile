FROM node:22.11-alpine3.20

EXPOSE 4000

WORKDIR /usr/app/server

COPY node_modules node_modules

COPY dist dist

CMD ["node", "dist/main"]

