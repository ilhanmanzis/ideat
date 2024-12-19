import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const login = async(request, h)=>{
    const {email, password} = request.payload;

    //mencari data user berdasarkan email
    const queryEmail = await db.collection('users').where('email', '==', email).get();
    
    //jika email user tidak ditemukan
    if (queryEmail.empty) {
        return h.response({ 
        status:'fail',
        message:{
          errors: {
             email : 'Email tidak terdaftar'
          }
        },
        data:null
      }).code(404);
    }

    //ambil data dari query email
    const userDoc = queryEmail.docs[0];
    const user = userDoc.data();

     // Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return h.response({
            status: 'fail',
            message: {
                errors: { password: 'Password salah' }
            },
            data: null
        }).code(400);
    }

    // membuat token jwt
    const token = await jwt.sign({id: user.id, email: user.email,}, process.env.ACCESS_TOKEN_SECRET);

    return h.response({
        status:'success',
        message:'Login berhasil',
        data:{
            id: user.id,
            nama: user.nama,
            token:token
        }
    })
}
export default login;