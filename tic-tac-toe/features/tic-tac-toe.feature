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

    Esquema del escenario: Un jugador gana la partida
        Dado un jugador llamado "<jugador1>" y un jugador llamado "<jugador2>"
        Cuando "<jugador1>" selecciona "X" en la posición <posicion1>
        Y "<jugador2>" selecciona "O" en la posición <posicion2>
        Y "<jugador1>" selecciona "X" en la posición <posicion3>
        Y "<jugador2>" selecciona "O" en la posición <posicion4>
        Y "<jugador1>" selecciona "X" en la posición <posicion5>
        Entonces "<jugador1>" debería ser el ganador
        Y el juego debería estar terminado

        Ejemplos:
        | jugador1 | jugador2 | posicion1 | posicion2 | posicion3 | posicion4 | posicion5 |
        | Ana      | Mario    | 1         | 2         | 4         | 5         | 7         |
        | Juan     | Pedro    | 1         | 3         | 5         | 2         | 6         |

    Esquema del escenario: El juego termina en empate
        Dado un jugador llamado "<jugador1>" y un jugador llamado "<jugador2>"
        Cuando "<jugador1>" selecciona "X" en la posición <posicion1>
        Y "<jugador2>" selecciona "O" en la posición <posicion2>
        Y "<jugador1>" selecciona "X" en la posición <posicion3>
        Y "<jugador2>" selecciona "O" en la posición <posicion4>
        Y "<jugador1>" selecciona "X" en la posición <posicion5>
        Y "<jugador2>" selecciona "O" en la posición <posicion6>
        Y "<jugador1>" selecciona "X" en la posición <posicion7>
        Y "<jugador2>" selecciona "O" en la posición <posicion8>
        Y "<jugador1>" selecciona "X" en la posición <posicion9>
        Entonces el juego debería estar terminado
        Y el resultado debería ser empate

        Ejemplos:
            | jugador1 | jugador2 | posicion1 | posicion2 | posicion3 | posicion4 | posicion5 | posicion6 | posicion7 | posicion8 | posicion9 |
            | Ana      | Mario    | 1         | 2         | 3         | 7         | 5         | 6         | 4         | 9         | 8         |
            | Juan     | Pedro    | 1         | 2         | 4         | 3         | 5         | 7         | 8         | 6         | 9         |
