const net = require('net');

const client = net.createConnection({ host:'192.168.18.9', port: 3000 }, () => {
    console.log('Conectado al servidor de juego.');
});

client.on('data', (data) => {
    const message = data.toString();
    console.log(message);

    // Si el mensaje contiene la frase "tu turno", permitir que el jugador ingrese su movimiento
    if (message.includes('Es tu turno')) {
        process.stdin.resume();
    }
});

process.stdin.on('data', (data) => {
    client.write(data);  // Enviar el movimiento al servidor
    process.stdin.pause();  // Pausar el input hasta que sea nuevamente tu turno
});
