FROM node:14 as build

WORKDIR /app

ARG REACT_APP_WS_HOST
ARG REACT_APP_WS_PORT
ARG REACT_APP_USE_HTTPS
ARG REACT_APP_VERSION

ENV REACT_APP_WS_HOST=$REACT_APP_WS_HOST
ENV REACT_APP_WS_PORT=$REACT_APP_WS_PORT
ENV REACT_APP_USE_HTTPS=$REACT_APP_USE_HTTPS
ENV REACT_APP_VERSION=$REACT_APP_VERSION

COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app/

RUN npm run build

FROM nginx:1.21

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
