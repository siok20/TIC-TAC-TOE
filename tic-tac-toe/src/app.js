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

const partidasActivas = new client.Gauge({ 
    name: 'tic_tac_toe_active_games',
    help: 'Número de partidas activas en el sistema',
});

const puntuacionJugador = new client.Gauge({
    name: 'tic_tac_toe_player_score',
    help: 'Puntuaciones de los jugadores',
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
let gameId = 1;
partidasActivas.set(0);

io.on("connection",(socket)=>{

 
    socket.on("find",(e)=>{
        
        if(e.name!=null){
            
            arr.push(e.name)

            socket.join(gameId)
            
            if(arr.length>=2){
                let p1obj={
                    p1name:arr[0],
                    p1value:"X",
                    p1move:""
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"O",
                    p2move:""
                }
                
                let obj={
                    id:gameId,
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArray.push(obj)

                partidasActivas.inc(); // Incrementa cuando se inicia una nueva partida
                
                arr.splice(0,2)
                
                io.to(gameId).emit("find", { allPlayers: [obj] })

                gameId++
            }
            
        }
        
    })
    
    socket.on("playing",(e)=>{
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)
            
            objToChange.p1.p1move=e.id
            objToChange.sum++
        }
        else if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)
            
            objToChange.p2.p2move=e.id  
            objToChange.sum++
        }

        io.emit("playing",{allPlayers:playingArray})
        
    })
    
    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        partidasActivas.dec();  //Decrementa cuando una partida termina
        puntuacionJugador.labels(e.name).inc(); 
        console.log(playingArray)

    })

    //Acceder a un juego por su id
    socket.on("viewGame", (e)=>{
        console.log(e.id*-1)
        let game = playingArray.find(obj => obj.id === e.id)

        if(!game){
            //Si no existe el juego emite un error
            socket.emit("error", { message: "game not found" })
        }
        else{
            socket.emit("viewGame", { game })
        }
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
    res.send("Games")
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

