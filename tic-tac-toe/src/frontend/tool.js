user = document.getElementById("userCont")
opp = document.getElementById("oppNameCont")
document.getElementById("notFound").style.display = "none"

const socket = io();

document.getElementById("getID").addEventListener('input', function(e){
    const getid = e.target.value

    document.getElementById("user").textContent = `${getid}`
    document.getElementById("oppName").textContent = `${getid*-1}`

    if(getid == NaN){
        document.getElementById("user").textContent = " "
        document.getElementById("oppName").textContent = " "
    }else{
        socket.emit('viewGame', {id : getid})
    }
    
})

socket.on("viewGame", (e) => {
    document.getElementById("user").textContent = `${e.p1.p1name}`
    document.getElementById("oppName").textContent = `${e.p2.p2name}`
})

socket.on("error", (e)=>{
    document.getElementById.apply("notFound").style.display = "block"
})