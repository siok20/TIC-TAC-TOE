# language: es

Característica: Manejo de Errores

    Como jugador 
    quiero recibir mensajes de error 
    para cuando se realice movimientos inválidos

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

    Esquema del escenario: Movimiento inválido
        Dado un jugador llamado "<jugador1>" y un jugador llamado "<jugador2>"
        Cuando "<jugador1>" selecciona "X" en la posición <posicion_invalida>
        Entonces debería recibir un mensaje de error "Movimiento inválido"

        Ejemplos:
        | jugador1 | jugador2 | posicion_invalida |
        | Ana      | Mario    | 10                |
        | Juan     | Pedro    | 0                 |
