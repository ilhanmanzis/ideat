import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import db from "../config/db.js"

const register = async(request, h)=>{
    const {nama, email, password}= request.payload;
    
    
    //membuat collection user
    const userCollections = db.collection('users');

    //validasi email
    const queryEmail = await userCollections.where('email', '==', email).get();
    if (!queryEmail.empty) {
        return h.response({ 
        status:'fail',
        message:{
          errors: {
             email : 'Email sudah terdaftar'
          }
        },
        data:null
      }).code(400);
    }
    const id = nanoid(16);
    //membuat dokumen user dengan nama id
    const userDocs = await userCollections.doc(id)

    //membuat enkripsi password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);


    const profileUser = {
        id : id,
        nama: nama,
        email: email,
        jenis_kelamin: null,
        tanggal_lahir: null, 
        berat_badan: null, 
        tinggi_badan: null,
        password: hashedPassword,
    }

    await userDocs.set(profileUser);

    return h.response({ 
      status:'succcess',
      message: 'User berhasil terdaftar',
      data:null
    }).code(201);

}

export default register;