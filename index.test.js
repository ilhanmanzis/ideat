import dotenv from "dotenv";
dotenv.config();
import Hapi from "@hapi/hapi";
import routes from './src/routes.js';

const createServer = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    server.route(routes);
    return server;
};

import supertest from 'supertest';

describe('Hapi.js Server', () => {
    let server;

    beforeAll(async () => {
        server = await createServer();
    });

    afterAll(async () => {
        await server.stop();
    });

    it('/ should respond with 200 on a valid route', async () => {
        const response = await supertest(server.listener)
            .get('/') 
            .expect(200);

        expect(response.body).toBeDefined();
    });

    it('should respond with 404 for an invalid route', async () => {
        const response = await supertest(server.listener)
            .get('/invalid-route')
            .expect(404);

        expect(response.body).toBeDefined();
    });
});
