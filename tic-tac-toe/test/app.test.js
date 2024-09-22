const request = require('supertest');
const { startServer } = require('../src/app');

describe('GET /', () => {
    let serverInstance;

    // Antes de las pruebas, inicia el servidor
    beforeAll((done) => {
        serverInstance = startServer(3000);
        done();
    });

    // Después de las pruebas, cierra el servidor
    afterAll((done) => {
        serverInstance.close(done);
    });

    describe('GET /', () => {
        it('debería retornar el archivo index.html', async () => {
            const response = await request(serverInstance).get('/');
            expect(response.status).toBe(200);
            expect(response.header['content-type']).toEqual(expect.stringContaining('html'));
        });
    });
});

