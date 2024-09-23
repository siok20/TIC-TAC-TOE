# pc1-grupo11



# Game.js
 este código gestiona la búsqueda de un usuario enviando su nombre a través de un socket y proporciona retroalimentación visual al usuario (mostrando una animación de carga y desactivando el botón).


![](assets/getElementById.png)



Este código actualiza la interfaz de usuario cuando el servidor responde con la lista de jugadores, muestra información sobre el oponente encontrado, y prepara la interfaz para el juego (como mostrar el turno actual). Es parte de un flujo de un juego multijugador donde dos jugadores están siendo emparejados y se actualiza el estado del juego en función de sus datos.

![](assets/sockertFIND.png)


Este código gestiona la interacción del jugador de Tic-Tac-Toe. Cada vez que un jugador hace clic en una casilla:
1. Verifica si es su turno.
2. Actualiza la casilla del jugador (X u O).
3. Informa al servidor sobre el movimiento hecho, enviando los detalles del turno, como el jugador y la casilla seleccionada.

De esta forma, el juego puede sincronizarse entre los jugadores, permitiendo que el servidor controle el estado y valide los movimientos

![](assets/querySelectorAll.png)


Este código maneja el evento playing que se emite por el servidor a través del socket. Cada vez que un jugador realiza un movimiento, el servidor envía información que actualiza la interfaz del juego y el estado del turno. lo que hace es
1. Escucha el evento playing emitido por el servidor para obtener los movimientos realizados por ambos jugadores.
2. Actualiza el tablero visualmente mostrando las "X" y "O" en las casillas correspondientes.
3. Cambia el turno entre los jugadores "X" y "O" y muestra el turno actual en la interfaz.
4. Desactiva las casillas que ya fueron seleccionadas para evitar que se elijan nuevamente.

Esto asegura que el juego se sincronice entre los jugadores y que la interfaz siempre refleje el estado correcto de la partida.

![](assets/playing.png)


La función check es responsable de verificar si hay un ganador o si el juego ha terminado en empate en una partida de Tic-Tac-Toe. También gestiona la emisión de eventos al servidor en caso de victoria o empate y recarga la página para reiniciar el juego.

![](assets/funcionCheck.png)