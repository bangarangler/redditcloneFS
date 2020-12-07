FROM node:14
#ENV NODE_ENV=production

WORKDIR /usr/src/app

# COPY ["package.json", "package-lock.json*", "./"]
COPY package.json ./

# RUN npm install --production
RUN npm install

COPY . .
COPY .env.production .env

RUN npm run build

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
USER node
