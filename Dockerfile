FROM node:8
COPY package.json package-lock.json ./
RUN npm i
COPY . .
RUN npm run deploy
