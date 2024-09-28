# pc1-grupo11 ~ branch

## feature/solution-online
Rama hecha con la finalidad de reestructurar parcialmnente `app.js` y añadir un sistema de ranked

## app.js
Se modifico el evento `gameOver` para modificar la informacion de cada jugador y añadir el ganador a cada partida

``` bash
//evento de finalizacion de partida
    socket.on("gameOver",(e)=>{
        //busca al jugador que emitió el evento
        let me = players.find(obj => obj.name == e.name)

        //Si el juego quedó en empate se suma solo un punto
        if(e.winner == " - "){
            me.points++
        }
        //Si ganas te sumas 2 puntos y una victoria
        else if (e.winner == me.name){
            me.points++;
            me.points++;

            me.wins++;
        }

        //Busca el juego por el id y añade al ganador
        playingArray.find(obj => obj.id == e.id).winner = e.winner
       
        console.log(playingArray)
        console.log(players)
    })
```

Se añadieron los eventos `viewGame`, `viewGames` y `viewPlayers`. Retornan la informacion de una partida, todas las partidas y todos los jugadores respectivamente

## Conexiones
Se conectan los archivos de la siguiente forma

```
index.html <-> game.js <--------
                               |
games.html <-> tool.js <-------|---> app.js
                               |  
stats.html <-> toolStats.js <---
```

## /games
Creado para poder buscar el resultado de una partida mediante su ID
El archivo `games.hmtl` accede al `id` del input mediante `tool.js` 

```bash
socket.on("viewGame", (e) => {
    console.log("+")
    document.getElementById("user").textContent = `${e.game.p1.name}`
    document.getElementById("oppName").textContent = `${e.game.p2.name}`
    document.getElementById("whosWon").textContent = `${e.game.winner}`
})

socket.on("error", (e)=>{
    console.log("-")
    document.getElementById("notFound").style.display = "block"
})
```
Dos eventos que se conectan con `app.js` el primero recibe la informacion de un juego en específico y el otro se llama solo si el juego no ha sifdo encontrado

## /stats
Creado para ver una tabla de todos los juegos o de todos los jugadores y su información

```bash
document.getElementById("Bplayers").addEventListener('click', function(){
    
    socket.emit("viewPlayers", {})

})

document.getElementById("Bgames").addEventListener('click', function(){
    
    socket.emit("viewGames", {})

})
```
Dos eventos para elegir ver el historial de juegos o jugadores

Luego se aplica la lógica de JS para visualizar las tablas 