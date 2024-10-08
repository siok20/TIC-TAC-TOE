document.getElementById("loading").style.display = "none";
document.getElementById("boardgame").style.display = "none";

const socket = io();

//Nombre del jugador actual
let name;
//Almacenará el id de la partida actual
let currentId;
//El valor de juego que toca primero
let currentPlayer = "X"; 

//El juego empieza cuando se clickea el boton find
document.getElementById('find').addEventListener("click", function () {
    name = document.getElementById("name").value
    document.getElementById("user").innerText = name 
    if (name == null || name == '') {
        alert("Please enter a name")
    }
    else {
        //Si el nombre es valido se envia el evento find a app.js con el nombre del jugador actual
        socket.emit("find", { name: name })

        document.getElementById("loading").style.display = "block";
        document.getElementById("find").style.display= "none";
    }
})

//Recibe el retorno del evento find de parte de app.js
socket.on("find", (e) => {
    /*
    El evento find alista visualmente toda la pagina 
    con logica JS, el nombre del jugador y del oponente
    e internanemente cambia el currentId al de la partida
    */

    console.log(socket)

    currentId = e.id;

    if (name != '') {
        document.getElementById("main").style.display = "none";
        document.getElementById("boardgame").style.display= "block";
    }

    let oppName
    let value

    const object = e.obj
    console.log(object)
    object.p1.name == `${name}` ? oppName = object.p2.name : oppName = object.p1.name
    object.p1.name == `${name}` ? value = object.p1.value : value = object.p2.value

    document.getElementById("oppName").innerText = oppName
    document.getElementById("value").innerText = value
})

//Añade eventos a cada boton al momento de clickearlos
document.querySelectorAll(".btn").forEach(e => {
    e.addEventListener("click", function () {
        let value = document.getElementById("value").innerText
        // Verificar si es el turno del jugador actual
        if (currentPlayer !== value) {
            alert("No es tu turno.");
            return;
        }
        e.innerText = value
        //En caso sea un turno valido emitimos el evento playing a app.js
        //Envia el valor de juego actual, el id del boton seleccionado, el nombre del jugador y el id de la partida
        socket.emit("playing", { value: value, move: e.id, name: name, idGame: currentId })
    })
})

//Recibe el evento playing de app.js
socket.on("playing", (e) => {
    //Encuentra del objeto de la partida por su id
    const foundObject = e.objToChange

    //Toma los movimientos de ambos jugadores
    p1id = foundObject.p1.move
    p2id = foundObject.p2.move

    //El turno se determina por si la cantidad de movimientos hechos es par o impar
    if ((foundObject.sum) % 2 == 0) {
        currentPlayer = "O";  // Cambiar el turno a O
        document.getElementById("whosTurn").innerText = "Turno de O"
    } else {
        currentPlayer = "X";  // Cambiar el turno a X
        document.getElementById("whosTurn").innerText = "Turno de X"
    }

    //Pone visualmente a los botones el valor que se le ha asignado
    if (p1id != '') {
        document.getElementById(`${p1id}`).innerText = "X"
        document.getElementById(`${p1id}`).disabled = true
        document.getElementById(`${p1id}`).style.color = "black"
    }
    if (p2id != '') {
        document.getElementById(`${p2id}`).innerText = "O"
        document.getElementById(`${p2id}`).disabled = true
        document.getElementById(`${p2id}`).style.color = "black"
    }

    //Checekamos el estado de la partida
    socket.emit("check", {id: foundObject.id})
    //check(name, foundObject)
})

socket.on("gameOver", (e)=>{
    currentPlayer = "X"

    if(e.winner == " - "){

        
        socket.emit("gameOver", { name: name, winner: " - ", id:currentId })

        //Emitimos una alerta y recargamos la pagina
        setTimeout(() => {
            alert("Empate!!")
            setTimeout(() => {
                location.reload()
            }, 2000)
        }, 100)
    }else{
        let obj = e.winner

        socket.emit("gameOver", { name: name, winner: obj.name, id:currentId })
        
        setTimeout(() => {
            alert(`Victoria de ${obj.name}`)
            setTimeout(() => {
                location.reload()
            }, 2000)
        }, 100)
    }
})

//Checkea el estado de la partida
function check(name, foundObject) {
    //Asiganmos las variables bi, que representan a cada boton
    //Si un boton no ha sido clickeado le toca una letra
    document.getElementById("btn1").innerText == '' ? b1 = "a" : b1 = document.getElementById("btn1").innerText
    document.getElementById("btn2").innerText == '' ? b2 = "b" : b2 = document.getElementById("btn2").innerText
    document.getElementById("btn3").innerText == '' ? b3 = "c" : b3 = document.getElementById("btn3").innerText
    document.getElementById("btn4").innerText == '' ? b4 = "d" : b4 = document.getElementById("btn4").innerText
    document.getElementById("btn5").innerText == '' ? b5 = "e" : b5 = document.getElementById("btn5").innerText
    document.getElementById("btn6").innerText == '' ? b6 = "f" : b6 = document.getElementById("btn6").innerText
    document.getElementById("btn7").innerText == '' ? b7 = "g" : b7 = document.getElementById("btn7").innerText
    document.getElementById("btn8").innerText == '' ? b8 = "h" : b8 = document.getElementById("btn8").innerText
    document.getElementById("btn9").innerText == '' ? b9 = "i" : b9 = document.getElementById("btn9").innerText

    let sum = foundObject.sum
    let winner

    //Con 10 clicks ya la partida queda en empate
    if (sum == 10) {
        //En caso haya empate, retornamos el current player a X
        currentPlayer = "X"
        //Emitimos el evento juego terminado a app.js
        //Enviamos el jugador presente, el ganador y el id de la partida
        socket.emit("gameOver", { name: name, winner: " - ", id:foundObject.id })
        //Emitimos una alerta y recargamos la pagina
        setTimeout(() => {
            alert("Empate!!")
            setTimeout(() => {
                location.reload()
            }, 2000)
        }, 100)
    }
    //Combinaciones para victoria
    else if ((b1 == b2 && b2 == b3) || (b4 == b5 && b5 == b6) || (b7 == b8 && b8 == b9) || (b1 == b4 && b4 == b7) || (b2 == b5 && b5 == b8) || (b3 == b6 && b6 == b9) || (b1 == b5 && b5 == b9) || (b3 == b5 && b5 == b7)) {
        //En caso haya victoria, retornamos el current player a X
        currentPlayer = "X"
        //Segun el turno verificamos quien era el ganador
        sum % 2 == 0 ? winner = foundObject.p1.name : winner = foundObject.p2.name
        //Emitimos el evento juego terminado a app.js
        //Enviamos el jugador presente, el ganador y el id de la partida
        socket.emit("gameOver", { name: name, winner: winner, id:foundObject.id  })

        //Emitimos una alerta y recargamos la pagina
        setTimeout(() => {
            sum % 2 == 0 ? alert("X WON !!") : alert("O WON !!")
            setTimeout(() => {
                location.reload()
            }, 2000)
        }, 100)
    }
    
}
