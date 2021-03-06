FROM node:carbon-alpine

COPY ./ /origin

WORKDIR /origin

RUN npm install && \
    npm run build && \
    npm prune --production && \
    mv /origin/bin /app && \
    mv /origin/node_modules /app && \
    rm -rf /origin

WORKDIR /app

EXPOSE 8080

CMD [ "node", "server.js" ]