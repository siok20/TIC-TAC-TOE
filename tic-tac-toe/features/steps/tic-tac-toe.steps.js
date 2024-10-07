const {Given, When, Then} = require('@cucumber/cucumber');
const {expect} = require('chai');
const io = require('socket.io-client');

let socket;
let response;

// Paso para el jugador con el nombre "Ana"
Given('un jugador con el nombre {string}', function (nombreJugador) {
  socket = io.connect('http://localhost:4000'); // Conectar al servidor de Socket.IO
  socket.emit('find', {name: nombreJugador});
});

// Paso para el segundo jugador que se une
Given('otro jugador con el nombre {string}', function (nombreJugador) {
  socket.emit('find', { name: nombreJugador });
});

// Paso para cuando ambos jugadores se unen al juego
/*
When('ambos jugadores se unan al juego', function () {
    return new Promise((resolve) => {
        socket.on('find', (data) => {
            response = data; // Asignar la respuesta
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
    });
});
*/
When('ambos jugadores se unan al juego', function () {
    socket.on('find', (data) => {
        response = data; // Asignar la respuesta
    });
});

// Paso para verificar que se ha creado una nueva partida
/*
Then('debería crearse una nueva partida con el tablero vacío', function () {
    expect(response).ot.exist;
    expect(response.obj.board).to.equal('         '); // Nos debe devolver un tablero vacío
    expect(response.id).to.exist; // Verifica que se creo un id
});  
*/
Then('debería crearse una nueva partida con el tablero vacío', function () {
    socket.on('find', (data) => {
    response = data; // Asignar la respuesta
    expect(response).ot.exist;
    expect(response.obj.board).to.equal('         '); // Nos debe devolver un tablero vacío
    expect(response.id).to.exist; // Verifica que se creo un id
    });
});  

// Paso para iniciar el juego entre dos jugadores

Given('un jugador llamado {string} comienza a jugar con {string}', function (jugador1, jugador2) {
    // Emitir el evento para encontrar a ambos jugadores
    socket.emit('find', { name: jugador1 });
    socket.emit('find', { name: jugador2 });
    
    socket.on('find', (data) => {
      response = data; // Guardar la respuesta para usarlo luego
   });
});
  
// Paso para realizar un movimiento
/*
When('{string} selecciona {string} en la posición {int}', function (jugador, marca, posicion) {
    // Emitir el evento de juego con la información del movimiento

    socket.emit('playing', { idGame: response.id, value: marca, move: `pos${posicion}` });
});
*/
When('{string} selecciona {string} en la posición {int}', function (jugador, marca, posicion) {
    return new Promise((resolve) => {
        // Escuchar el evento 'find' para asegurarte de que tienes los datos correctos
        socket.on('find', (data) => {
            response = data; // Guardar la respuesta para usarla luego
            resolve(); // Resuelve la promesa para continuar con la prueba
            socket.emit('playing', { idGame: response.id, value: marca, move: `pos${posicion}` });
        });
    });
});


// Paso para verificar que el tablero muestra el movimiento
Then('el tablero debería mostrar {string} en la posición {int}', function (marca, posicion) {
    socket.on('playing', (data) => {
      const boardPosition = data.objToChange.board.charAt(posicion - 1);
      expect(boardPosition).to.equal(marca); // Verificar que el movimiento esté en la posición correcta
    });
}); 

// Paso para verificar que es el turno del otro jugador
Then('debería ser el turno de {string}', async function (nombreSiguienteJugador) {
    // Usar un promise para manejar la asincronía
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 !== 0; // Si la suma es impar, es el turno de X
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;

            expect(expectedPlayer).to.equal(nombreSiguienteJugador);
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
    });
});

/*
When('ambos jugadores se unan al juego', function () {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 !== 0; // Si la suma es impar, es el turno de X
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;

            expect(expectedPlayer).to.equal(nombreSiguienteJugador);
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
    });
});
*/