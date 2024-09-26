user = document.getElementById("userCont")
opp = document.getElementById("oppNameCont")
document.getElementById("notFound").style.display = "none"

const socket = io();

document.getElementById("getID").addEventListener('input', function(e){
    const getid = e.target.value

    document.getElementById("notFound").style.display = "none"

    if(isNaN(getid) || getid === ""){
        document.getElementById("user").textContent = `${getid}`
        document.getElementById("oppName").textContent = `${getid}`
    }else{
        console.log(getid)
        socket.emit('viewGame', {id : getid})
    }
    
})

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