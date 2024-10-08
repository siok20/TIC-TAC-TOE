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
    Dado un jugador llamado "Ana" comienza a jugar con "Mario"
    Cuando "Ana" selecciona "X" en la posición 1
    Entonces debería ser el turno de "Mario"
    Cuando "Mario" selecciona "O" en la posición 2
    Entonces debería ser el turno de "Ana"

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
        | Ana      | Mario    | 1         | 2         | 3         |
        | Juan     | Pedro    | 1         | 2         | 4         |
