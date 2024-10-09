# language: es

Característica: Realización de Movimientos

    Como jugador
    quiero realizar movimientos válidos en el tablero
    para poder jugar al Tic-Tac-Toe correctamente

    Escenario: Un jugador hace un movimiento
    Dado un jugador llamado "Ana" comienza a jugar con "Mario"
    Cuando "Ana" selecciona "X" en la posición 1
    Entonces el tablero debería mostrar "X" en la posición 1
    Y debería ser el turno de "Mario"

    Escenario: Cambiar de turno entre los jugadores
    Dado un jugador con el nombre "Ana"
    Y otro jugador con el nombre "Mario"
    Cuando "Ana" selecciona "X" en la posición 1
    Y "Mario" selecciona "O" en la posición 2
    Entonces el tablero debería mostrar "X" en la posición 1
    Y el tablero debería mostrar "O" en la posición 2
    Y debería ser el turno de "Ana"

    Esquema del escenario: Cambiar de turno entre los jugadores
    Dado un jugador llamado "<jugador1>" comienza a jugar con "<jugador2>"
    Cuando "<jugador1>" selecciona "<marca>" en la posición <posicion1>
    Entonces debería ser el turno de "<jugador2>"
    Y "<jugador2>" selecciona "<marca2>" en la posición <posicion2>
    Y debería ser el turno de "<jugador1>"

    Ejemplos:
        | jugador1 | jugador2 | marca | posicion1 | marca2 | posicion2 |
        | Ana      | Mario    | X     | 1         | O      | 2         |
        | Juan     | Pedro    | X     | 3         | O      | 4         |

