# language: es

Característica: Validación de No Ganador

    Como jugador
    quiero validar que un jugador no sea declarado ganador 
    para cuando no se ha cumplido la condición de victoria

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
