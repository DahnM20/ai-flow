FROM node:14 as build

WORKDIR /app

ARG VITE_APP_WS_HOST
ARG VITE_APP_WS_PORT
ARG VITE_APP_USE_HTTPS
ARG VITE_APP_VERSION

ENV VITE_APP_WS_HOST=$VITE_APP_WS_HOST
ENV VITE_APP_WS_PORT=$VITE_APP_WS_PORT
ENV VITE_APP_USE_HTTPS=$VITE_APP_USE_HTTPS
ENV VITE_APP_VERSION=$VITE_APP_VERSION

COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app/

RUN npm run build

FROM nginx:1.21

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
