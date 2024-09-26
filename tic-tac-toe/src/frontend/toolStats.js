const socket = io()

document.getElementById("Bplayers").addEventListener('click', function(){
    
    socket.emit("viewPlayers", {})

})

document.getElementById("Bgames").addEventListener('click', function(){
    
    socket.emit("viewGames", {})

})

socket.on("viewGames", (e)=>{
    
    let table = document.getElementById("games")

    e.games.forEach(game => {

        let newRow = table.insertRow()

        let id = newRow.insertCell(0)
        let versus = newRow.insertCell(1)
        let winner = newRow.insertCell(2)

        id.innerHTML = game.id
        versus.innerHTML = `${game.p1.name} vs. ${game.p2.name}`
        winner.innerHTML = game.winner

    });

})

socket.on("viewPlayers", (e)=>{
    let table = document.getElementById("players")


})