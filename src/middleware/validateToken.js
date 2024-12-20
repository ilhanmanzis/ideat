import jwt from "jsonwebtoken";

const validateToken = async(request, h)=>{
    const authHeader = request.headers.authorization;
    //verifikasi token kosong
    if(!authHeader){
        return h.response({
            status:'fail',
            message:{
                errors:{
                    token: 'Authorization header missing'
                }
            },
            data:null
        }).code(401).takeover();
    };


    const token = authHeader.split(' ')[1];
    try {
        //verifikasi token
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request.user = decode;

        return h.continue;
    } catch (error) {
        //jika token tidak valid
        return h.response({ 
        status:'fail',
        message:{
            errors:{
            token:'Invalid token'
            }
        },
        data:null
        }).code(403).takeover();
    }
}

export default validateToken;