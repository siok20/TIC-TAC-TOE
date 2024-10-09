# language: es

Característica: Condiciones de Victoria y Empate

    Como jugador
    quiero que el juego determine un ganador o empate
    para finalizar la partida de manera justa

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
