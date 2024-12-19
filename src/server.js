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
    await server.start();
    console.log(`server run is ${server.info.uri}`);

})();