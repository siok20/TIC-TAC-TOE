user = document.getElementById("userCont")
opp = document.getElementById("oppNameCont")
document.getElementById("notFound").style.display = "none"

const socket = io();

//Añadimos el evento al input por cada inserción que se haga
document.getElementById("getID").addEventListener('input', function(e){
    //Reicibimos el evento
    const getid = e.target.value

    document.getElementById("notFound").style.display = "none"

    //Si no es un numero o no se escribio nada
    if(isNaN(getid) || getid === ""){
        //Dejamos en blanco los campos
        document.getElementById("user").textContent = " "
        document.getElementById("oppName").textContent = " "
    }
    //Si es valido emitimos el evento view game a app.js con el id requerido
    else{
        socket.emit('viewGame', {id : getid})
    }
    
})

//Recepciona el evento viewgame de app.js
//Y lo añade a la pagina con logica de JS
socket.on("viewGame", (e) => {
    document.getElementById("user").textContent = `${e.game.p1.name}`
    document.getElementById("oppName").textContent = `${e.game.p2.name}`
    document.getElementById("whosWon").textContent = `${e.game.winner}`
})

//Recepciona el evento error de app.js
//Y muestra el error en la pagina con logica de JS
socket.on("error", (e)=>{
    document.getElementById("notFound").style.display = "block"
})