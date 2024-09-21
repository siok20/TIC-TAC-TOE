const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let tablero = [
    ['¹', '²', '³'],
    ['⁴', '⁵', '⁶'],
    ['⁷', '⁸', '⁹']
];

let jugadorActual = 'X';

function mostrarTablero() {
    console.log(`
     ${tablero[0][0]} | ${tablero[0][1]} | ${tablero[0][2]}
    -----------
     ${tablero[1][0]} | ${tablero[1][1]} | ${tablero[1][2]}
    -----------
     ${tablero[2][0]} | ${tablero[2][1]} | ${tablero[2][2]}
    `);
}

function verificarGanador() {
    const posibilidades = [
        // Filas
        [tablero[0][0], tablero[0][1], tablero[0][2]],
        [tablero[1][0], tablero[1][1], tablero[1][2]],
        [tablero[2][0], tablero[2][1], tablero[2][2]],
        // Columnas
        [tablero[0][0], tablero[1][0], tablero[2][0]],
        [tablero[0][1], tablero[1][1], tablero[2][1]],
        [tablero[0][2], tablero[1][2], tablero[2][2]],
        // Diagonales
        [tablero[0][0], tablero[1][1], tablero[2][2]],
        [tablero[0][2], tablero[1][1], tablero[2][0]]
    ];

    for (const linea of posibilidades) {
        if (linea.every(celda => celda === jugadorActual)) {
            return true;
        }
    }
    return false;
}

function tableroLleno() {
    return tablero.flat().every(celda => celda === 'X' || celda === 'O');
}


function jugar() {
    mostrarTablero();
    rl.question(`Jugador ${jugadorActual}, elige una posición (1-9): `, posicion => {
        posicion = parseInt(posicion);

        if (posicion >= 1 && posicion <= 9) {
            const fila = Math.floor((posicion - 1) / 3);
            const columna = (posicion - 1) % 3;

            if (tablero[fila][columna] === '¹' || tablero[fila][columna] === '²' || tablero[fila][columna] === '³'
                || tablero[fila][columna] === '⁴' || tablero[fila][columna] === '⁵' || tablero[fila][columna] === '⁶'
                || tablero[fila][columna] === '⁷' || tablero[fila][columna] === '⁸' || tablero[fila][columna] === '⁹') {
                tablero[fila][columna] = jugadorActual;

                if (verificarGanador()) {
                    mostrarTablero();
                    console.log(`¡Jugador ${jugadorActual} gana!`);
                    rl.close();
                } else if (tableroLleno()) {
                    mostrarTablero();
                    console.log('¡Es un empate!');
                    rl.close();
                } else {
                    jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
                    jugar();
                }
            } else {
                console.log('Posición ocupada, elige otra.');
                jugar();
            }
        } else {
            console.log('Posición no válida. Elige un número entre 1 y 9.');
            jugar();
        }
    });
}

jugar();
