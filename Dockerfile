FROM node:8
COPY package.json ./
COPY functions/package.json ./functions/
RUN npm i && npm i --prefix functions
COPY . .
ARG firebasekey
RUN FIREBASE_TOKEN=$firebasekey npm run build
RUN npm run deploy
