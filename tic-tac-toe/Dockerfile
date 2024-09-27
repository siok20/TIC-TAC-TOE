FROM node:14

WORKDIR /app/tic-tac-toe

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
