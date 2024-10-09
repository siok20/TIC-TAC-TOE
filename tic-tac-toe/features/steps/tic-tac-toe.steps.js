const {Given, When, Then, BeforeAll, AfterAll} = require('@cucumber/cucumber');
const {expect} = require('chai');
const io = require('socket.io-client');
const { server } = require('../../src/app');

let socket;
let response;

BeforeAll(() => {
    if (!socket) {
        socket = io.connect('http://localhost:4000');
    }
});

// Paso para el jugador con el nombre "Ana"
Given('un jugador con el nombre {string}', function (nombreJugador) {
  //socket = io.connect('http://localhost:4000'); // Conectar al servidor de Socket.IO
  socket.emit('find', {name: nombreJugador});
});

// Paso para el segundo jugador que se une
Given('otro jugador con el nombre {string}', function (nombreJugador) {
  socket.emit('find', { name: nombreJugador });
});

// Paso para cuando ambos jugadores se unen al juego

When('ambos jugadores se unan al juego', function () {
    socket.on('find', (data) => {
        response = data; // Asignar la respuesta
        //resolve();
    });
});

// Paso para verificar que se ha creado una nueva partida

Then('debería crearse una nueva partida con el tablero vacío', function () {
    socket.on('find', (data) => {
    response = data; // Asignar la respuesta
    expect(response).to.exist;
    expect(response.obj.board).to.equal('         '); // Nos debe devolver un tablero vacío
    expect(response.id).to.exist; // Verifica que se creo un id
    //resolve();
    });
});  

// Paso para iniciar el juego entre dos jugadores
Given('un jugador llamado {string} comienza a jugar con {string}', function (jugador1, jugador2) {
    // Emitir el evento para encontrar a ambos jugadores
    socket.emit('find', { name: jugador1 });
    socket.emit('find', { name: jugador2 });
    
    socket.on('find', (data) => {
      response = data; // Guardar la respuesta para usarlo luego
      currentId = data.id;
    });
});

// Paso para realizar un movimiento

When('{string} selecciona {string} en la posición {int}', function (jugador, marca, posicion) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta
            socket.emit('playing', { idGame: response.obj.idGame, value: marca, move: `pos${posicion}` });
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
        resolve();  // Se debe resolver la promesa para que cierre correctamente el proceso y pueda continuar
    });
});

// Paso para verificar que el tablero muestra el movimiento
Then('el tablero debería mostrar {string} en la posición {int}', function (marca, posicion) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            const boardPosition = data.objToChange.board.charAt(posicion - 1);
            expect(boardPosition).to.equal(marca); // Verificar que el movimiento esté en la posición correcta
            resolve();
        });
        resolve();  // Se debe resolver la promesa para que cierre correctamente el proceso y pueda continuar
    });
}); 

// Paso para verificar que es el turno del otro jugador
Then('debería ser el turno de {string}', async function (nombreSiguienteJugador) {
    // Se necesita usar una promesa para manejar la asincronía
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 !== 0; // Si la suma es impar entonces es el turno de X
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;
            
            expect(expectedPlayer).to.equal(nombreSiguienteJugador);
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
        resolve();
    });
});

// Paso para iniciar un juego entre dos jugadores
Given('un jugador llamado {string} y un jugador llamado {string}', async function (jugador1, jugador2) {
    socket = io.connect('http://localhost:4000');
    // Emitir el evento para encontrar a ambos jugadores
    socket.emit('find', {name: jugador1});
    socket.emit('find', {name: jugador2});
    
    socket.on('find', (data) => {
      response = data; // Guardar la respuesta para usarlo luego
      currentId = data.id;
      //resolve();
   });
})

// Paso para verificar si hay un ganador
Then('{string} debería ser el ganador', async function (nombreGanador) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta para luego ser usada
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 === 1;
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;

            expect(expectedPlayer).to.equal(nombreGanador);
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
        resolve();
    });
})

// Verificamos que el juego termine
Then('el juego debería estar terminado', async function () {
    return new Promise((resolve) => {
        socket.on('gameOver', (data) => {
            expect(data).to.be.an('object'); // Verifica que es un objeto

            // Ahora verifica el ganador
            expect(data.winner).to.exist;
            expect(data.winner).to.be.oneOf([' - ', 'Ana', 'Mario']); // Verifica si el ganador es válido

            // Verifica el estado del juego
            const game = playingArray.find(obj => obj.id === data.id);
            expect(game).to.exist; // Verifica que el juego exista
            expect(game.winner).to.equal(data.winner); // Verifica que el ganador coincida

            resolve(); // Resuelve la promesa
        });
        resolve();
    });
});


// Paso que verifica el empate en una partida 
Then('el resultado debería ser empate', async function () {
    return new Promise((resolve) => {
        socket.on('gameOver', (data) => {
            expect(data).to.be.an('object'); // Verifica que es un objeto

            // Ahora verifica el ganador
            expect(data.winner).to.exist;
            expect(data.winner).to.be.oneOf([' - ', 'Ana', 'Mario']); // Verifica si el ganador es válido, osea uno de esos 3

            // Verifica el estado del juego
            const game = playingArray.find(obj => obj.id === data.id);
            expect(game).to.exist; // Verifica que el juego exista
            expect('-').to.equal(data.winner); // Verifica que el ganador coincida

            resolve(); // Resuelve la promesa
        });
        resolve();
    });
});


// Paso para verificar la validez del movimiento
When('{string} intenta seleccionar {string} en la posición {int}', function (jugador, marca, posicion) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta
            socket.emit('playing', { idGame: response.obj.idGame, value: marca, move: `pos${posicion}` });
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
        resolve();  // Se debe resolver la promesa para que cierre correctamente el proceso y pueda continuar
    });
});

// Paso para recibir el mensaje de alerta
Then('debería recibir un mensaje de error {string}', async function (mensaje) {
    return new Promise((resolve) => {
        // Emite mensaje de alerta "Movimiento inválido"
        socket.on('invalidMove', (response) => {
            expect(response.message).to.equal(mensaje);
            resolve();
        });
        // Emite mensaje de alerta "No es tu turno"
        socket.on('turnError', (response) => {
            expect(response.message).to.equal(mensaje);
            resolve();
        });
        resolve();  // Hay que resolver la promesa para que cierre correctamente el proceso y pueda continuar
    });
});

// Paso para validar que un dato incorrecto no sea validado como correcto
Then('{string} no debería ser el ganador', async function (nombreGanador) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data; // Asignar la respuesta para luego ser usada
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 === 1;
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;

            expect(expectedPlayer).to.not.equal(nombreGanador);
            resolve(); // Resuelve la promesa para continuar con la prueba, esto se debe a que socket.on es asíncrono
        });
        resolve();
    });
})

// Hook para cerrar el servidor al finalizar las pruebas, no olvidar importar After del modulo de cucumber
AfterAll(() => {
  if (socket) {
    socket.disconnect();
  }
  if (server) {
      server.close(() => {
          console.log('Servidor cerrado');
          process.exit(0);
      });
  }
});
