const net = require('net');

let tablero = [
    ['¹', '²', '³'],
    ['⁴', '⁵', '⁶'],
    ['⁷', '⁸', '⁹']
];

let jugadorActual = 'X';
const clientes = [];

const server = net.createServer((socket) => {
    console.log('Un jugador se ha conectado');

    // Agregar el nuevo cliente
    clientes.push(socket);

    // Enviar el tablero inicial al nuevo jugador
    socket.write(mostrarTablero());

    // Para escuchar cuando se manden datos
    socket.on('data', (data) => {
        const posicion = parseInt(data.toString().trim());
        if(posicion >= 1 && posicion <= 9){
            const fila = Math.floor((posicion - 1) / 3);
            const columna = (posicion - 1) % 3;
    
            if (tablero[fila][columna] !== 'X' && tablero[fila][columna] !== 'O') {
                tablero[fila][columna] = jugadorActual;
    
                // Enviar el tablero a todos los clientes
                clientes.forEach(cliente => {
                    cliente.write(mostrarTablero());
                });
    
                // Cambiar de jugador
                jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
            } else {
                socket.write('Posición ocupada, elige otra.\n');
            }    
        }else{
            console.log("Casilla ocupada, elija otra casilla \n")
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
    console.log('Servidor corriendo en puerto 3000');
});
