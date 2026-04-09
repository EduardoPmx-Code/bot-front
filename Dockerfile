FROM node:20-alpine

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app

COPY --chown=node:node package.json package-lock.json* ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
