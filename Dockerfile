FROM node:10.15.0-slim

WORKDIR /usr/src/bot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
