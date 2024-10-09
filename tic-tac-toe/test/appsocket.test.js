const { server } = require('../src/app'); // Asegúrate de que esta ruta sea correcta
const io = require('socket.io-client');

let socket1;
let socket2;

function waitPlaying(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("Servidor Socket", () => {

    beforeEach((done) => {
        server.listen(4000, () => {
            console.log('Servidor iniciado en el puerto 4000');
            socket1 = io('http://localhost:4000');
            socket2 = io('http://localhost:4000');

            let socketsConnected = 0;

            // Esperar a que ambos sockets se conecten
            socket1.on('connect', () => {
                socketsConnected++;
                if (socketsConnected === 2) {
                    done();
                }
            });

            socket2.on('connect', () => {
                socketsConnected++;
                if (socketsConnected === 2) {
                    done();
                }
            });
        });
    });

    afterEach((done) => {
        if (socket1.connected) socket1.disconnect();
        if (socket2.connected) socket2.disconnect();

        server.close(() => {
            console.log('Servidor cerrado');
            done();
        });
    });

    test("debe encontrar una partida y emparejar jugadores empezando el tablero vacio", (done) => {
        socket1.emit("find", { name: "Jugador1" });
        socket2.emit("find", { name: "Jugador2" });

        socket1.on("find", (data) => {
            expect(data).toHaveProperty("id");
            expect(data).toHaveProperty("obj");
            expect(data.obj).toHaveProperty("board");
            expect(data.obj.board).toBe("         ");
        });

        socket2.on("find", (data) => {
            expect(data).toHaveProperty("id");
            expect(data).toHaveProperty("obj");
            expect(data.obj).toHaveProperty("board");
            expect(data.obj.board).toBe("         ");
            console.log("Partida iniciada con el tablero vacio");
            console.log(data.obj.board.split(""));
            done();
        });
    }, 10000);

    test("X ganador de una partida", (done) => {
        socket1.emit("find", { name: "Jugador1" });
        socket2.emit("find", { name: "Jugador2" });

        socket2.on("find", (data) => {
            const gameId = data.id;

            socket1.emit("playing", { idGame: gameId, value: "X", move: "cell1" });
            socket2.emit("playing", { idGame: gameId, value: "O", move: "cell4" });
            socket1.emit("playing", { idGame: gameId, value: "X", move: "cell2" });
            socket2.emit("playing", { idGame: gameId, value: "O", move: "cell5" });
            socket1.emit("playing", { idGame: gameId, value: "X", move: "cell3" });
            
						setTimeout(() => {
							socket1.emit("check", { id: gameId });

							socket1.on("gameOver", (data) => {
									expect(data.winner.name).toEqual("Jugador2");
							});

							socket2.on("gameOver", (data) => {
									expect(data.winner.name).toEqual("Jugador2"); 
									done();
							});
						}, "1000");
						
						
        });
    }, 10000);

		test("O ganador de una partida", (done) => {
			socket1.emit("find", { name: "Jugador1" });
			socket2.emit("find", { name: "Jugador2" });

			socket2.on("find", (data) => {
					const gameId = data.id;

					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell1" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell2" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell4" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell3" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell5" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell6" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell8" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell9" });
					
					setTimeout(() => {
						socket1.emit("check", { id: gameId });

						socket1.on("gameOver", (data) => {
								expect(data.winner.name).toEqual("Jugador1"); 
						});

						socket2.on("gameOver", (data) => {
								expect(data.winner.name).toEqual("Jugador1"); 
								done();
						});
					}, "5000");
					
					
			});
	}, 15000);

    test("debe dar el empate de una partida", (done) => {
			socket1.emit("find", { name: "Jugador3" });
			socket2.emit("find", { name: "Jugador4" });
	
			socket2.on("find", (data) => {
					const gameId = data.id;
					console.log("ID de la partida para empate:", gameId);
	
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell1" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell2" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell5" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell3" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell6" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell4" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell7" });
					socket2.emit("playing", { idGame: gameId, value: "O", move: "cell9" });
					socket1.emit("playing", { idGame: gameId, value: "X", move: "cell8" });
					
					setTimeout(() => {
						socket1.emit("check", { id: gameId });

						socket1.on("gameOver", (data) => {
								expect(data.winner).toEqual(" - "); 
						});

						socket2.on("gameOver", (data) => {
								expect(data.winner).toEqual(" - "); 
								done();
						});
					}, "5000");
				});
			
	}, 15000);
	
});