const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Crear el servidor HTTP
const server = http.createServer(app);
const io = new Server(server);  

// Importar prom-client para métricas
const client = require('prom-client');
const register = new client.Registry();
const collectDefaultMetrics = client.collectDefaultMetrics;

// Recolectar métricas predeterminadas cada 5 segundos
collectDefaultMetrics({timeout: 5000})

// Middleware para medir la duración de las solicitudes
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    registers: [register],
});

// Middleware para registrar la duración de cada solicitud
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.route ? req.route.path : req.path });
    });
    next();
});


const counter = new client.Counter({
    name: 'node_request_operations_total',
    help: 'The total number of processed requests'
})

const histogram = new client.Histogram({
    name: 'node_request_duration_seconds',
    help: 'Histogram for the duration in seconds',
    buckets: [1,2,5,6,10]
})

// Servir archivos estáticos desde la carpeta actual
app.use(express.static(path.resolve(__dirname, 'frontend'))); // Usa __dirname para la ruta correcta

let arr=[];
let playingArray=[];
let gameId = 0;

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
        console.log(playingArray)
    })
    
    
})

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    // Incrementar el contador de solicitudes
    counter.inc();
        
    // Medir la duración de la solicitud
    const end = histogram.startTimer();
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'), () => {
        // Detener el cronómetro cuando la respuesta se haya enviado
        end();
    });
});

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Iniciar el servidor
server.listen(4000, () => {
    console.log('Server running on port 4000');
});

