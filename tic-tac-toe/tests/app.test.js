const request = require('supertest');
const app = require('../src/app'); // Importamos la app

describe('Tic-Tac-Toe API REST', () => {
    let gameId;

    beforeAll(async () => {
        const res = await request(app).post('/games').send();
        gameId = res.body.id; // Crear un nuevo juego antes de las pruebas
    });

    afterAll(() => {
        console.log('Todas las pruebas han finalizado.');
    });

    describe('POST /games', () => {
        it('should create a new game', async () => {
            const res = await request(app).post('/games').send();
            expect(res.statusCode).toEqual(201); // Confirma que la partida fue creada
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('board');
            expect(res.body.board).toEqual([null, null, null, null, null, null, null, null, null]); // Tablero vacío
            expect(res.body).toHaveProperty('currentPlayer', 'X');
        });
    });

    describe('GET /games/:id', () => {
        it('should return the state of an existing game', async () => {
            // Obtener el estado del juego creado
            const res = await request(app).get(`/games/${gameId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', gameId);
            expect(res.body).toHaveProperty('board');
            expect(res.body).toHaveProperty('currentPlayer', 'X');
        });

    // Crea un nuevo juego antes de cada prueba
    beforeEach(async () => {
        const res = await request(app).post('/games').send();
        gameId = res.body.id;
    });

    describe('PATCH /games/:id', () => {
        it('should update the game state with a valid move', async () => {
            const res = await request(app)
                .patch(`/games/${gameId}`)
                .send({ playerId: 'X', position: 4 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.board[4]).toBe('X');
            expect(res.body.currentPlayer).toBe('O'); // El turno cambia al siguiente jugador
        });

        it('should return an error if the position is invalid', async () => {
            const res = await request(app)
                .patch(`/games/${gameId}`)
                .send({ playerId: 'X', position: 10 }); // Fuera del rango

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Posicion invalida');
        });

        it('should update the game state with a valid move and check turn change', async () => {
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 4 });

            const res = await request(app)
                .patch(`/games/${gameId}`)
                .send({ playerId: 'O', position: 5 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.board[5]).toBe('O');
            expect(res.body.currentPlayer).toBe('X'); // Turno de 'X' de nuevo
        });

        it('should update the game state to "Finalizado" when a player wins', async () => {
            let res = await request(app).post('/games').send();
            const gameId = res.body.id;
        
            // Secuencia de movimientos
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 0 }); // X en 0
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'O', position: 1 }); // O en 1
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 3 }); // X en 3
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'O', position: 4 }); // O en 4
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 6 }); // X en 6, X gana
        
            // Verifica el estado del juego
            res = await request(app).get(`/games/${gameId}`);
            expect(res.body.status).toBe('Finalizado');
            expect(res.body.winner).toBe('X');
        });                            

        it('should update the game state to "Empate" when the board is full', async () => {
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 0 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'O', position: 1 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 2 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'O', position: 3 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 5 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'O', position: 4 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 7 });
            await request(app).patch(`/games/${gameId}`).send({ playerId: 'O', position: 8 });
        
            // El último movimiento debería causar empate
            const res = await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 6 });
        
            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toBe('Empate');
        });        
    });
});

    describe('GET /games/:id (invalid game)', () => {
        it('should return a 404 for a non-existent game', async () => {
            const res = await request(app).get('/games/9999'); // id que no existe
            expect(res.statusCode).toEqual(404);    //no se encuentra el id
            expect(res.body).toHaveProperty('error', 'Partida no encontrada');
        });
    });
});
