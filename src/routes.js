import login from "./handlers/login.js";
import register from "./handlers/register.js";
import { loginSchema, validateLogin } from "./middleware/validateLogin.js";
import { registerSchema, validateRegister } from "./middleware/validateRegister.js";

const routes = [
    {
        method:'GET',
        path:'/',
        handler: ()=>{
            return "welcome to api ideat";
        }
    },
    {
        method:'POST',
        path:'/register',
        options: {
            pre: [{ method: validateRegister(registerSchema) }],
        },
        handler: register
    },
    {
        method: 'POST',
        path: '/login',
        options:{
            pre:[{ method: validateLogin(loginSchema)}]
        },
        handler: login
    }
];

export default routes;