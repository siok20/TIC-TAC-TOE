FROM node:20

WORKDIR /app

COPY tic-tac-toe/package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "tic-tac-toe/src/app.js"]