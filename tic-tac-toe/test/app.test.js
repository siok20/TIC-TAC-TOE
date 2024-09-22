const request = require('supertest');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración del servidor
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Prueba del puerto
describe('Server Port Test', () => {
    let serverInstance;

    beforeAll((done) => {
        serverInstance = server.listen(3000, done);
    });

    afterAll((done) => {
        serverInstance.close(done);
    });

    test('should be running on port 3000', (done) => {
        request(serverInstance)
            .get('/')
            .expect(200, done);
    });
});
