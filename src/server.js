import dotenv from "dotenv";
dotenv.config();

import Hapi from "@hapi/hapi";
import routes from "./routes.js";

(async()=>{
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: process.env.NODE_ENV !== 'production' ? 'localhost':'0.0.0.0',
        routes:{
            cors:{
                origin:['*']
            }
        }
    });

    server.route(routes);
    server.ext('onPreResponse', function (request, h){
        const response = request.response;

        if(response.isBoom){
            if (statusCode >= 500) {
            console.error('Server Error:', response.stack); // Log error untuk debugging

            // Buat respons khusus untuk kesalahan server
            const newResponse = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
                data: null,
            });
            newResponse.code(500);
            return newResponse;
        }

        // Jika error adalah kesalahan client (4xx)
        const newResponse = h.response({
            status: 'fail',
            message: response.message,
            data: null,
        });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        return h.continue;
    })


    await server.start();
    console.log(`server run is ${server.info.uri}`);

})();