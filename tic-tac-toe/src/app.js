const express = require('express');
const app = express();

app.use(express.json()); //PAra manejar JSON en los request

//Array para almacenar los juegos 
let games = [];
let gameIdCounter = 1;
const WINNING_COMBINATIONS = [
    [0, 1, 2], // Fila 1
    [3, 4, 5], // Fila 2
    [6, 7, 8], // Fila 3
    [0, 3, 6], // Columna 1
    [1, 4, 7], // Columna 2
    [2, 5, 8], // Columna 3
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Diagonal
];

let scores = {
    X: 0,
    O: 0
};

//Primer endpoint: Crea una nueva partida
app.post('/games', (req, res) => {
    const newGame = {
        id: gameIdCounter++,
        board: Array(9).fill(null),
        currentPlayer: 'X',
        status: 'En progreso',
        winner: null // Agregar la propiedad winner
    };
    games.push(newGame);
    res.status(201).json(newGame);
});


//Segundo endpoint: Obtiene el estado de una partida
app.get('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const game = games.find(g => g.id === gameId);  //busca una partida por el id, g representa el objeto de partida

    if(!game) {
        return res.status(404).json({error: 'Partida no encontrada'});
    }

    res.json(game);
});

// Tercer endpoint: Se actualiza el estado de la partida por cada movimiento que se haga
app.patch('/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const game = games.find(g => g.id === gameId);

    if (!game) {
        return res.status(404).json({ error: 'Partida no encontrada' });
    }

    // Verificar si el juego ya ha terminado
    if (game.status !== 'En progreso') {
        return res.status(403).json({ error: 'La partida ya ha finalizado' });
    }

    const { playerId, position } = req.body;

    // Verifica la validez de la posición 
    if (position < 0 || position > 8 || game.board[position] != null) {
        return res.status(400).json({ error: 'Posicion invalida' });
    }

    // Verificamos que sea el turno del jugador correspondiente
    if (playerId !== game.currentPlayer) {
        return res.status(403).json({ error: 'No es tu turno' });
    }

    game.board[position] = playerId;

    // Verificar si hay un ganador
    for (const combo of WINNING_COMBINATIONS) {
        if (combo.every(index => game.board[index] === playerId)) {
            game.winner = playerId; // Establece el ganador
            game.status = 'Finalizado'; // Cambia el estado
            scores[playerId]++; // Incrementa el puntaje
            return res.json({ game, scores }); // Responde aquí
        }
    }

    // Comprobar si el tablero está lleno
    if (game.board.every(pos => pos !== null)) {
        game.status = 'Empate'; // Establecer estado de empate
    } else {
        // Cambiar el turno
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    }    

    // Responder siempre con el estado actualizado
    res.json(game);
});

// Cuarto endpoint: Se obtiene todas las partidas
app.get('/games', (req, res) => {
    res.json(games); // Nos devuelve la lista de partidas
});

// Configuramos el puerto
if(require.main === module){
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;