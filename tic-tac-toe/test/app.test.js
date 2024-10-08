//const { io } = require('socket.io-client');
//const http = require('http');
const request = require('supertest');
const {app} = require('../src/app'); 

const URL = "http://localhost:4000";
let server;

describe('Pruebas para endpoints HTTP', function() {
    
    beforeAll(() => {
        server = app.listen(0);
    });


    afterAll(() => {
        server.close();
    });


    describe('Pruebas de Endpoints HTTP', function() {
        it('debería servir el archivo index.html en la ruta raíz', function(done) {
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });

        it('debería servir el archivo tables.html en /tables', function(done) {
            request(app)
                .get('/tables')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });

        it('debería servir el archivo games.html en /games', function(done) {
            request(app)
                .get('/games')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });

        it('debería devolver métricas en /metrics', (done) => {
            request(app)
                .get('/metrics')
                .expect('Content-Type', /text/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.text).toContain('nodejs_http_total_count');
                    done();
                });
        }, 5000); 
        
    });

    
});
