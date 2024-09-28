const socket = io()

//Emite el evento viewPlayers a app.js luego de un clic en el boton
document.getElementById("Bplayers").addEventListener('click', function(){
    
    socket.emit("viewPlayers", {})

})

//Emite el evento viewGames a app.js luego de un clic en el boton
document.getElementById("Bgames").addEventListener('click', function(){
    
    socket.emit("viewGames", {})

})

//Recepciona el evento viewGames de app.js
//Muestra en una tabla todos los juegos mediante logica JS
socket.on("viewGames", (e)=>{

    document.getElementById("players").style.display = "none"
    document.getElementById("games").style.display = "block"

    let tableBody = document.createElement('tbody')

    e.games.forEach(game => {

        let newRow = document.createElement('tr')

        newRow.innerHTML = `<td>${game.id}</td>
                            <td>${game.p1.name} vs. ${game.p2.name} </td>
                            <td>${game.winner}</td>`

        tableBody.appendChild(newRow)
    });

    let oldTbody = document.querySelector('#games tbody');
    if (oldTbody) {
        oldTbody.remove();
    }
    document.querySelector('#games').appendChild(tableBody);

})

//Recepciona el evento viewPlayers de app.js
//Muestra en una tabla todos los juagdores mediante logica JS
socket.on("viewPlayers", (e)=>{

    document.getElementById("games").style.display = "none"
    document.getElementById("players").style.display = "block"

    let tableBody = document.createElement('tbody')

    e.players.forEach(player => {

        let newRow = document.createElement('tr')

        newRow.innerHTML = `<td>${player.name}</td>
                            <td>${player.wins}</td>
                            <td>${player.points}</td>
                            <td>${player.wins/player.games}</td>`

        tableBody.appendChild(newRow)
    });

    let oldTbody = document.querySelector('#players tbody');
    if (oldTbody) {
        oldTbody.remove();
    }
    document.querySelector('#players').appendChild(tableBody);
})