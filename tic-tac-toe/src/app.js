const net = require('net');

let tablero = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
];

let jugadorActual = 'X';
const clientes = [];

const server = net.createServer((socket) => {
    console.log('Un jugador se ha conectado');

    // Agregar el nuevo cliente
    clientes.push(socket);

    // Enviar el tablero inicial al nuevo jugador
    socket.write(mostrarTablero());

    // Indicar al primer jugador que es su turno
    if (clientes.length === 1) {
        socket.write('Es tu turno, elige una posición (1-9):\n');
    }

    // Para escuchar cuando se manden datos
    socket.on('data', (data) => {
        const posicion = parseInt(data.toString().trim());
        const jugador = socket === clientes[0] ? 'X' : 'O'; // Asignar jugador basado en el orden de conexión

        // Validar turno
        if (jugador !== jugadorActual) {
            socket.write('No es tu turno. Espera a que el otro jugador juegue.\n');
            return;
        }

        if(posicion >= 1 && posicion <= 9){
            const fila = Math.floor((posicion - 1) / 3);
            const columna = (posicion - 1) % 3;
    
            if (tablero[fila][columna] !== 'X' && tablero[fila][columna] !== 'O') {
                tablero[fila][columna] = jugadorActual;

                // Enviar el tablero actualizado a todos los clientes
                clientes.forEach(cliente => {
                    cliente.write(mostrarTablero());
                });

                // Cambiar de jugador
                jugadorActual = jugadorActual === 'X' ? 'O' : 'X';

                // Avisar al siguiente jugador que es su turno
                const siguienteJugador = jugadorActual === 'X' ? clientes[0] : clientes[1];
                if (siguienteJugador) {
                    siguienteJugador.write('Es tu turno, elige una posición (1-9):\n');
                }
            } else {
                socket.write('Posición ocupada, elige otra.\n');
            }
        } else {
            socket.write('Posición inválida. Elige un número entre 1 y 9.\n');
        }
    });

    socket.on('end', () => {
        console.log('Un jugador se ha desconectado');
        const index = clientes.indexOf(socket);
        if (index !== -1) {
            clientes.splice(index, 1);
        }
    });
});

function mostrarTablero() {
    return `
     ${tablero[0][0]} | ${tablero[0][1]} | ${tablero[0][2]}
    -----------
     ${tablero[1][0]} | ${tablero[1][1]} | ${tablero[1][2]}
    -----------
     ${tablero[2][0]} | ${tablero[2][1]} | ${tablero[2][2]}
    `;
}

const port = process.env.PORT || 3000;
server.listen(port , () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});
