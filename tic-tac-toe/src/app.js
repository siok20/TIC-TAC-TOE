const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');


// Crear el servidor HTTP
const server = http.createServer(app);
const io = new Server(server);  


const client = require('prom-client');
const { collectDefaultMetrics, register, Counter, Gauge } = client;

// Recolectar métricas predeterminadas cada 5 segundos
collectDefaultMetrics({timeout: 5000})

// Definir métricas
const httpMetricsLabelNames = ['method', 'path'];
const totalHttpRequestCount = new Counter({
  name: 'nodejs_http_total_count',
  help: 'Total number of HTTP requests',
  labelNames: httpMetricsLabelNames,
});
// definir metricas 
const totalHttpRequestDuration = new Gauge({
    name: 'nodejs_http_total_duration',
    help: 'The last duration of the last request',
    labelNames: httpMetricsLabelNames,
  });

// contabiliza el numero de partidas
const partidasActivas = new client.Gauge({ 
    name: 'tic_tac_toe_active_games',
    help: 'Número de partidas activas en el sistema',
});

// contabiliz la puntuacion del jugador
const puntuacionJugador = new client.Gauge({
    name: 'tic_tac_toe_player_score',
    help: 'Puntuaciones de los jugadores',
    labelNames: ['name']
});
  

// Middleware para medir las solicitudes HTTP
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      totalHttpRequestCount.labels(req.method, req.path).inc();
      totalHttpRequestDuration.labels(req.method, req.path).set(duration);
    });
    
    next();
  });


  
// Servir archivos estáticos desde la carpeta actual
app.use(express.static(path.resolve(__dirname, 'frontend'))); // Usa __dirname para la ruta correcta

//Array para los jugadores en espera
let arr=[];
//Array para almacenar las partidas
let playingArray=[];
//Array para almacenar a los jugadores
let players = []; 
//Añadimos un Id a cada partida que iremos cambiando 
let gameId = 1;
partidasActivas.set(0);

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{
        
        if(e.name!=null){

            //Se ingresa el nombre al array de espera    
            arr.push(e.name)

            //Se añade al emisor del evento a un room 
            socket.join(gameId)
            
            //Cuando hay más de 2 jugadores en la lista de espera
            if(arr.length>=2){

                //Buscamos a los dos jugadores en la lista players
                let ply1 = players.find(obj => obj.name == arr[0])
                let ply2 = players.find(obj => obj.name == arr[1])

                //en caso no se encuentren se crean sus usuarios
                /*
                cada jugador tiene :
                    nombre, cantidad de partidas, victorias y puntos (+1 empate, +2 victoria, 0 derrota)
                */
               //en caso los jugadores existan, se les añade una partida más
                if(!ply1){
                    ply1 = {
                        name: arr[0],
                        games: 1,
                        wins: 0,
                        points: 0
                    }
                    players.push(ply1)
                }
                else{
                    ply1.games++
                }

                if(!ply2){
                    ply2 = {
                        name: arr[1],
                        games: 1,
                        wins: 0,
                        points: 0
                    }
                    players.push(ply2)
                }
                else{
                    ply2.games++
                }

                console.log(players)

                //Aparte se crean los objetos players para que esten internamente en el objeto de partida
                /*
                cada player tiene :
                    nombre, valor de marca, y el movimiento que realiza.
                */

                let p1obj={
                    name:arr[0],
                    value:"X",
                    move:""
                }
                let p2obj={
                    name:arr[1],
                    value:"O",
                    move:""
                }
                
                //Se añade un id a cada juego, los dos players, el campo de ganador y la suma de movimientos realizados
                let obj={
                    id:gameId,
                    p1:p1obj,
                    p2:p2obj,
                    winner:"-",
                    sum:1
                }

                //Añadimos este objeto a la lista de partidas
                playingArray.push(obj)

                partidasActivas.inc(); // Incrementa cuando se inicia una nueva partida
                
                //Borramos los dos nombres de la lista de espera
                arr.splice(0,2)
                
                //Retornamos el evento find solo a los jugadores dentro del room
                io.to(gameId).emit("find", { allPlayers: [obj], id: gameId })

                //Cambiamos el id para los siguientes juegos
                gameId++
            }
            
        }
        
    })
    
    //Evento de juego
    socket.on("playing",(e)=>{
        //Toca jugar al X
        if(e.value=="X"){
            //Busca al juego por su id y luego verifica si el emisor del evento es player1
            let objToChange=playingArray.find(obj=>obj.id==e.idGame && obj.p1.name===e.name)
            
            //añade el movimiento a player1 y suma 1 movimiento a la partida
            objToChange.p1.move=e.id
            objToChange.sum++

        }
        //Toca jugar al O
        else if(e.value=="O"){
            //Busca al juego por su id y luego verifica si el emisor del evento es player2
            let objToChange=playingArray.find(obj=>obj.id==e.idGame && obj.p2.name===e.name)
            
            //añade el movimiento a player2 y suma 1 movimiento a la partida
            objToChange.p2.move=e.id  
            objToChange.sum++
        }

        //Emite el evento playing con el objeto necesario
        console.log(playingArray)
        io.emit("playing",{allPlayers:playingArray})
        
    })
    
    //evento de finalizacion de partida
    socket.on("gameOver",(e)=>{

        //busca al jugador que emitió el evento
        let me = players.find(obj => obj.name == e.name)
        partidasActivas.dec(0.5);  //Decrementa cuando una partida termina
        //Si el juego quedó en empate se suma solo un punto
        if(e.winner == " - "){
            me.points++
            puntuacionJugador.labels(e.name).inc();
        }
        //Si ganas te sumas 2 puntos y una victoria
        else if (e.winner == me.name){
            me.points++;
            me.points++;

            me.wins++;
            puntuacionJugador.labels(e.name).inc(2);
        }

        //Busca el juego por el id y añade al ganador
        playingArray.find(obj => obj.id == e.id).winner = e.winner
       
        console.log(playingArray)
        console.log(players)

       


    })

    //Acceder a un juego por su id
    socket.on("viewGame", (e)=>{
        let game = playingArray.find(obj => obj.id == e.id)

        if(!game){
            //Si no existe el juego emite un error
            console.log(`${e.id} game not found`)
            socket.emit("error", {})
        }
        else{
            //Si el jugador existe lo retorna
            console.log(game)
            socket.emit("viewGame", { game })
        }
    })

    //Retorna la informacion de un jugador por su id
    socket.on("viewPlayers", (e)=>{
        socket.emit("viewPlayers", {players: players})
    })

    //Retorna la informacion de un juego por su id
    socket.on("viewGames", (e)=>{
        socket.emit("viewGames", {games: playingArray})
    })
    
    
})

// Ruta para servir el archivo play.html
app.get('/', (req, res) => {        
    // Medir la duración de la solicitud
    const end = histogram.startTimer();
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'), () => {
        // Detener el cronómetro cuando la respuesta se haya enviado
        end();
    });
});

//obtener el listado de varias partidas
app.get('/tables', (req, res)=> {
    res.sendFile(path.resolve(__dirname, 'frontend', 'tables.html'))
})


//Ruta para obtener la informacion de una partida por su id
app.get('/games', (req, res)=> {
    
    res.sendFile(path.resolve(__dirname, 'frontend', 'games.html'))
})


// Ruta para métricas
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});


// Iniciar el servidor
server.listen(4000, () => {
    console.log('Server running on port 4000');
});
