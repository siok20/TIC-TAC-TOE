FROM node:20

WORKDIR /app/tic-tac-toe

COPY tic-tac-toe/package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "src/app.js"]