# language: es

Característica: Gestión de la Partida

    Como usuario
    quiero iniciar una partida con otro jugador
    para poder comenzar a jugar al Tic-Tac-Toe

    Escenario: Iniciar una partida
        Dado un jugador con el nombre "Ana"
        Y otro jugador con el nombre "Mario"
        Cuando ambos jugadores se unan al juego
        Entonces debería crearse una nueva partida con el tablero vacío
