## Feature/HTML

En esta rama del proyecto agregamos los cambios en los archivos .html y .css.

----------------------------

En esta parte del main se tiene lo esencial para mostrar al inicio: El título del juego (tic-tac-toe), una etiqueta que te pide tu nombre, el cuadro input para el nombre y el botón para buscar otro jugador. 
```bash
 <div id="main">
        <h1>Tic-Tac-Toe</h1>
        <div class="name-box">
            <h2 class="nombre">Escribe tu nombre :D</h2>
            <div>
                <input type="text" placeholder="Nombre" id="name" autocomplete="off">
            </div>
            <button id="find">Buscar jugador</button>
            <img id="loading" src="loading.gif" alt="">
        </div>
        
    </div>
```
Luego de que hayan 2 jugadores se ocultará con un poco de javascript lo del main, para pasar a la parte del tablero de juego, aquí estará los nombres de los oponentes, el aviso del turno actual y el tres en raya.
```bash
    <div id="boardgame">
        <div id="gameinfo">
            <div id="userCont">Tú: <span id="user"></span></div>
            <div id="oppNameCont">Oponente: <span id="oppName"></span></div>
        </div>
        <div id="valueCont">Estás jugando como:  <span id="value"></span></div>
        <div id="whosTurn">Turno de X</div>
        <div id="cont">
            <button id="btn1" class="btn"></button>
            <button id="btn2" class="btn"></button>
            <button id="btn3" class="btn"></button>
            <button id="btn4" class="btn"></button>
            <button id="btn5" class="btn"></button>
            <button id="btn6" class="btn"></button>
            <button id="btn7" class="btn"></button>
            <button id="btn8" class="btn"></button>
            <button id="btn9" class="btn"></button>
        </div>
    </div>
```