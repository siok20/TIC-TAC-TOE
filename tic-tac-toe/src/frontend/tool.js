user = document.getElementById("userCont")
opp = document.getElementById("oppNameCont")

const socket = io();

document.getElementById("getID").addEventListener('input', function(e){
    const getid = e.target.value



    document.getElementById("user").textContent = `${getid}`
    document.getElementById("oppName").textContent = `${getid*-1}`
})