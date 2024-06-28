FROM node:20.14-alpine3.20 as build

WORKDIR /build
COPY --chown=node:node ./package.json /build/package.json
RUN mkdir /build/packages

RUN chown -R node:node /build

COPY --chown=node:node ./packages/frontend /build/packages/frontend
COPY --chown=node:node ./packages/common /build/packages/common

RUN npm install

RUN cd /build/packages/frontend && npm run build

FROM nginx:alpine

COPY --from=build /build/packages/frontend/dist /usr/share/nginx/html

COPY ./packages/frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
