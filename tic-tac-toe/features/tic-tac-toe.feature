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

    Esquema del escenario: El juego termina en empate                           # Scenario outline
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

    Esquema del escenario: Cambiar de turno entre los jugadores
        Dado un jugador llamado "<jugador1>" comienza a jugar con "<jugador2>"
        Cuando "<jugador1>" selecciona "<marca>" en la posición <posicion1>
        Entonces debería ser el turno de "<jugador2>"
        Cuando "<jugador2>" selecciona "<marca2>" en la posición <posicion2>
        Entonces debería ser el turno de "<jugador1>"

        Ejemplos:
            | jugador1 | jugador2 | marca | posicion1 | marca2 | posicion2 |
            | Ana      | Mario    | X     | 1         | O      | 2         |
            | Juan     | Pedro    | X     | 3         | O      | 4         |

    Esquema del escenario: No es el turno del jugador
        Dado un jugador llamado "<jugador1>" y un jugador llamado "<jugador2>"
        Cuando "<jugador1>" selecciona "X" en la posición <posicion1>
        Y "<jugador2>" selecciona "O" en la posición <posicion2>
        Cuando "<jugador2>" intenta seleccionar "X" en la posición <posicion3>
        Entonces debería recibir un mensaje de error "No es tu turno"

        Ejemplos:
            | jugador1 | jugador2 | posicion1 | posicion2 | posicion3 |
            | Ana      | Mario    | 1         | 2         | 3         |  # Ana intenta jugar de nuevo
            | Juan     | Pedro    | 1         | 2         | 4         |  # Juan intenta jugar de nuevo

    Esquema del escenario: Movimiento inválido
        Dado un jugador llamado "<jugador1>" y un jugador llamado "<jugador2>"
        Cuando "<jugador1>" selecciona "X" en la posición <posicion_invalida>
        Entonces debería recibir un mensaje de error "Movimiento inválido"

        Ejemplos:
            | jugador1 | jugador2 | posicion_invalida |
            | Ana      | Mario    | 10                |  # Posición inválida (fuera de rango)
            | Juan     | Pedro    | 0                 |  # Posición inválida (fuera de rango)

    Escenario: Un jugador no debería ser el ganador
        Dado un jugador llamado "Ana" y un jugador llamado "Mario"
        Cuando "Ana" selecciona "X" en la posición 1
        Y "Mario" selecciona "O" en la posición 2
        Y "Ana" selecciona "X" en la posición 3
        Entonces "Mario" no debería ser el ganador

    Esquema del escenario: Un jugador no debería ser el ganador
        Dado un jugador llamado "<jugador1>" y un jugador llamado "<jugador2>"
        Cuando "<jugador1>" selecciona "X" en la posición <posicion1>
        Y "<jugador2>" selecciona "O" en la posición <posicion2>
        Y "<jugador1>" selecciona "X" en la posición <posicion3>
        Entonces "<jugador2>" no debería ser el ganador

        Ejemplos:
            | jugador1 | jugador2 | posicion1 | posicion2 | posicion3 |
            | Ana      | Mario    | 1         | 2         | 3         |
            | Juan     | Pedro    | 1         | 2         | 3         |

    