const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Crear el servidor HTTP
const server = http.createServer(app);
const io = new Server(server);  

// Servir archivos estáticos desde la carpeta actual
app.use(express.static(path.resolve(__dirname, 'frontend'))); // Usa __dirname para la ruta correcta

let arr=[]
let playingArray=[]

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{
        
        if(e.name!=null){
            
            arr.push(e.name)
            
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
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArray.push(obj)
                
                arr.splice(0,2)
                
                io.emit("find",{allPlayers:playingArray})
                
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
    res.sendFile(path.resolve(__dirname, 'frontend', 'index.html')); // Asegúrate de que el archivo exista en la ruta correcta
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Server running on port 3000');
});

