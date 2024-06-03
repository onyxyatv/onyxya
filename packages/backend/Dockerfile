FROM node:lts-alpine as build

WORKDIR /home/onyxya/backend

COPY package.json ./

RUN npm install

COPY . .

RUN chown -R node:node /home/onyxya/backend

USER node

RUN npm run build

FROM node:lts-alpine as production

WORKDIR /home/onyxya/backend

COPY --from=build /home/onyxya/backend/dist ./dist
COPY --from=build /home/onyxya/backend/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
