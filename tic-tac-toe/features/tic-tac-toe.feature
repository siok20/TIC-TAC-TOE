# language: es

Característica: Juego Tic-Tac-Toe 

    Como usuario 
    quiero encontrar un oponente 
    para poder jugar una partida

    Escenario: Iniciar una partida
        Dado un jugador con el nombre "Ana"
        Y otro jugador con el nombre "Mario"
        Cuando ambos jugadores se unan al juego
        Entonces debería crearse una nueva partida con el tablero vacío

    Escenario: Un jugador hace un movimiento
        Dado un jugador llamado "Ana" comienza a jugar con "Mario"
        Cuando "Ana" selecciona "X" en la posición 1
        Entonces el tablero debería mostrar "X" en la posición 1
        Y debería ser el turno de "Mario"