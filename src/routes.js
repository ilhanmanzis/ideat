import getUser from "./handlers/getUser.js";
import login from "./handlers/login.js";
import register from "./handlers/register.js";
import updatepassword from "./handlers/updatePassword.js";
import updateProfile from "./handlers/updateProfile.js";
import { loginSchema, validateLogin } from "./middleware/validateLogin.js";
import { profileSchema, validateProfile } from "./middleware/validateProfile.js";
import { registerSchema, validateRegister } from "./middleware/validateRegister.js";
import validateToken from "./middleware/validateToken.js";
import { passwordSchema, validateUpdatePassword } from "./middleware/validateUpdatePassword.js";

const routes = [
    {
        method:'*',
        path:'/{any*}',
        handler:(request, h)=>{
            return h.response({
                status:'fail',
                message:"404 Not Found",
                data:null
            }).code(404);
        }
    },
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
    },
    {
        method:'GET',
        path:'/user',
        options:{
            pre:[{method: validateToken}]
        },
        handler:getUser
    },
    {
        method:'PUT',
        path:'/profile',
        options:{
            pre:[
                {method:validateToken},
                {method:validateProfile(profileSchema)}
            ]
        },
        handler:updateProfile
    },
    {
        method:'PUT',
        path:'/password',
        options:{
            pre:[
                {method: validateToken},
                {method: validateUpdatePassword(passwordSchema)}
            ]
        },
        handler:updatepassword
    }
];

export default routes;