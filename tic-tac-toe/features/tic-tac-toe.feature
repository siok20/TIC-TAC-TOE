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

    Escenario: Cambiar de turno entre los jugadores
        Dado un jugador llamado "Ana" comienza a jugar con "Mario"
        Cuando "Ana" selecciona "X" en la posición 1
        Entonces debería ser el turno de "Mario"
        Cuando "Mario" selecciona "O" en la posición 2
        Entonces debería ser el turno de "Ana"

    Escenario: Un jugador gana la partida
        Dado un jugador llamado "Ana" comienza a jugar con "Mario"
        Cuando "Ana" selecciona "X" en la posición 1
        Y "Mario" selecciona "O" en la posición 2
        Y "Ana" selecciona "X" en la posición 4
        Y "Mario" selecciona "O" en la posición 5
        Y "Ana" selecciona "X" en la posición 7
        Entonces "Ana" debería ser el ganador
        Y el juego debería estar terminado
