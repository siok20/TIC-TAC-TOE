const net = require('net');

const client = net.createConnection({ host:'38.25.16.223',port: 3000 }, () => {
    console.log('Conectado al servidor de juego.');
});

client.on('data', (data) => {
    console.log(data.toString());
    if (data.toString().includes('elige una posición')) {
        process.stdin.resume();
    }
});

process.stdin.on('data', (data) => {
    client.write(data);
});
