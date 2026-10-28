FROM node:22-alpine
ARG APP_VERSION=v1
ENV APP_VERSION=${APP_VERSION} \
    PORT=8080
WORKDIR /app
COPY server.js .
USER node
EXPOSE 8080
CMD ["node", "server.js"]
