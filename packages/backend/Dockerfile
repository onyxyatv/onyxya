FROM node:20.14-alpine3.20 as build

WORKDIR /home/onyxya/

COPY --chown=node:node ./package.json .
RUN mkdir /home/onyxya/packages

COPY --chown=node:node ./packages/backend /home/onyxya/packages/backend
COPY --chown=node:node ./packages/common /home/onyxya/packages/common

RUN chown -R node:node /home/onyxya

USER node

RUN npm install

RUN cd /home/onyxya/packages/backend && npm run build

FROM node:20.14-alpine3.20 as production

USER node
WORKDIR /home/onyxya/backend

COPY --from=build /home/onyxya/packages/backend/dist ./dist
COPY --from=build /home/onyxya/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/backend/src/main"]