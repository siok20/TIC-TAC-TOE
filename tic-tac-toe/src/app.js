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

const totalHttpRequestDuration = new Gauge({
    name: 'nodejs_http_total_duration',
    help: 'The last duration of the last request',
    labelNames: httpMetricsLabelNames,
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

let arr=[];
let playingArray=[];
let playedArray=[];
let players = []; 
let gameId = 1;

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{
        
        if(e.name!=null){
            
            arr.push(e.name)

            socket.join(gameId)
            
            if(arr.length>=2){

                let ply1 = players.find(obj => obj.name == arr[0])
                let ply2 = players.find(obj => obj.name == arr[1])

                if(!ply1){
                    ply1 = {
                        name: arr[0],
                        games: 1,
                        wins: 0
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
                        wins: 0
                    }
                    players.push(ply2)
                }
                else{
                    ply2.games++
                }

                console.log(players)

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
                
                let obj={
                    id:gameId,
                    p1:p1obj,
                    p2:p2obj,
                    winner:"-",
                    sum:1
                }
                playingArray.push(obj)
                
                arr.splice(0,2)
                
                io.to(gameId).emit("find", { allPlayers: [obj] })

                gameId++
            }
            
        }
        
    })
    
    socket.on("playing",(e)=>{
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.name===e.name)
            
            objToChange.p1.move=e.id
            objToChange.sum++

        }
        else if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.name===e.name)
            
            objToChange.p2.move=e.id  
            objToChange.sum++
        }

        //console.log(playingArray)

        io.emit("playing",{allPlayers:playingArray})
        
    })
    
    socket.on("gameOver",(e)=>{
        let play = playingArray.filter(obj=>obj.p1.name!==e.name)
        let player = players.find(obj => obj.name == e.winner)

        if (player) {
            // Si se encuentra el jugador, incrementar sus victorias
            player.wins++;
            console.log(`El jugador ${e.winner} ha ganado una partida.`, player);
        } else {
            // Si no se encuentra, mostrar un mensaje de error
            console.error(`No se encontró al jugador con nombre ${e.winner}.`);
        }

        playingArray.find(obj => obj.id == e.id).winner = e.winner
        console.log(playingArray)
    })

    //Acceder a un juego por su id
    socket.on("viewGame", (e)=>{
        console.log(e.id*-1)
        let game = playingArray.find(obj => obj.id == e.id)

        if(!game){
            //Si no existe el juego emite un error
            console.log("game not found")
            socket.emit("error", { message: "game not found" })
        }
        else{
            console.log("game")
            socket.emit("viewGame", { game })
        }
    })

    socket.on("viewPlayers", (e)=>{
        socket.emit("viewPlayers", {players: players})
    })

    socket.on("viewGames", (e)=>{
        socket.emit("viewGames", {games: playingArray})
    })
    
    
})

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {        
    // Medir la duración de la solicitud
    const end = histogram.startTimer();
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'), () => {
        // Detener el cronómetro cuando la respuesta se haya enviado
        end();
    });
});

//obtener el listado de varias partidas
app.get('/stats', (req, res)=> {
    res.sendFile(path.resolve(__dirname, 'frontend', 'stats.html'))
    //console.log(playingArray);
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
    console.log('Server running on port 4000');
});

