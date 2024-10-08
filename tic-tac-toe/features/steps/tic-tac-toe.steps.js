// steps/tic-tac-toe.steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const io = require('socket.io-client');

let socket1;
let socket2;
let gameData;
let ply1;
let ply2;
let currentId = 1

Given('dos jugadores de nombres {string} y {string}', function (name1, name2) {
  ply1 = name1;
  ply2 = name2;
  socket1 = io('http://localhost:4000');  // Conéctate al servidor de Socket.IO
  socket2 = io('http://localhost:4000');  // Conéctate al servidor de Socket.IO
  socket1.emit('find', { name: ply1 });
  socket2.emit('find', { name: ply2 });
});

When('el primer jugador hace un movimiento {string}', function (move) {
  socket1.emit('playing', {value: "X", move: move, name:ply1, idGame: currentId})
});

Then('el tablero deberia mostrar {string} en la posicion {int}', function (marca, posicion) {
  socket.on('playing', (data) => {
    const board = data.objToChange.board.charAt(posicion-1)
    expect(board).to.equal(marca);  // Tablero vacío al inicio
  });
});

Given('una partida entre {string} y {string}', function (player1, player2) {
  // Configurar la partida entre los dos jugadores
  socket.emit('find', { name: player1 });
  socket.emit('find', { name: player2 });
});

When('{string} coloca una {string} en la posición {int}', function (player, mark, position) {
  socket.emit('playing', { idGame: gameData.id, value: mark, move: `btn${position}` });
});

Then('el tablero debe reflejar una {string} en la posición {int}', function (mark, position) {
  socket.on('playing', (data) => {
    const boardPosition = data.objToChange.board.charAt(position - 1);
    expect(boardPosition).to.equal(mark);  // Verificar el movimiento en el tablero
  });
});

Then('es el turno de {string}', function (nextPlayer) {
  socket.on('playing', (data) => {
    const currentTurn = data.objToChange.sum % 2 === 0 ? "O" : "X";
    expect(currentTurn).to.equal(nextPlayer);
  });
});
