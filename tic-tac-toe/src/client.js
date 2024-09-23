const axios = require('axios');  //Nos ayuda a realizar las solicitudes HTTP
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const URL = 'http://localhost:3000/games'; // hay que revisar eso

//Funcion crear nuevo juego
const createGame = async() => {
    const response = await axios.post(URL);
    console.log('Partida creada: ', response.data);
    return response.data.id;
};

//Funcion hacer un movimiento
const makeMove = async(gameId, playerId, position) =>{
    try{
        const response = await axios.patch(`${URL}/${gameId}`, {
            playerId,
            position
        });
        console.log('Estado actualizado: ', response.data);
        return response.data;
    } catch(error) {
        console.error('Error al hacer el movimiento: ', error.response.data.error);
        return null;
    }
};

//Funcion para obtener el estado de la partida
const getGameState = async (gameId) => {
    const response = await axios.get(`${URL}/${gameId}`);
    console.log('Estado de la partida: ', response.data);
    return response.data; // Devolver el estado de la partida
};

// Función para preguntar al usuario
const askPosition = (currentPlayer) => {
    return new Promise((resolve) => {
        rl.question(`Jugador ${currentPlayer}, ingrese una posición (0-8): `, (position) => {
            resolve(parseInt(position));
        });
    });
};

// Función para obtener las puntuaciones
const getScores = async () => {
    const response = await axios.get(`${URL}/scores`);
    console.log('Puntuaciones actuales: ', response.data);
};

// Función principal
const main = async () => {
    const gameId = await createGame();
    let currentPlayer = 'X';

    while (true) {
        const gameState = await getGameState(gameId);

        // Verificar si hay un ganador o si la partida ha terminado
        if (gameState.winner) {
            console.log(`¡El jugador ${gameState.winner} ha ganado!`);
            
            break;
        } else if (gameState.status === 'Empate') {
            console.log('¡La partida ha terminado en empate!');
            break;
        }

        const position = await askPosition(gameState.currentPlayer);

        // Solo hacer el movimiento si es el turno del jugador correcto
        const updatedGameState = await makeMove(gameId, gameState.currentPlayer, position);

        // Si el movimiento fue exitoso, cambiar de jugador
        if (updatedGameState) {
            currentPlayer = updatedGameState.currentPlayer; // Cambiar al siguiente jugador basado en el estado actualizado
        }
    }

    rl.close(); // Cerrar la interfaz al final
};

main();