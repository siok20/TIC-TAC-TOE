const request = require('supertest');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.resolve(__dirname, '../src/frontend'))); 

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../src/frontend', 'index.html')); 
});

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, () => {
        done();
    });
});

afterAll((done) => {
    server.close(done);
});

describe('GET /', () => {
    it('should serve the index.html file', async () => {
        const res = await request(server).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.header['content-type']).toMatch(/html/);
    });
});


