FROM node:lts as backend-build

USER onyxya

WORKDIR /home/onyxya/backend

COPY . /home/onyxya/backend/

RUN npm install && npm run build

FROM node:lts-alpine

USER onyxya

WORKDIR /home/onyxya/packages/backend

COPY --from=backend-build --chown=onyxya:onyxya /home/onyxya/backend .