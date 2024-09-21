const express = require("express")
const app = express();



app.get('/', (req,res)=>{
    res.send("Juego Tic-Tac-Toe! Empezar a jugar");
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server running on port 3000")
})

module.exports = app;