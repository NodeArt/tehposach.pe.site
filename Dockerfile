FROM node:8
COPY package.json ./
RUN npm i
COPY . .
RUN npm run deploy
