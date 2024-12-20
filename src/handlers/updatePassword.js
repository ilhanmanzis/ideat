import db from "../config/db.js";
import bcrypt from "bcrypt";

const updatepassword = async(request,h)=>{
    const id = request.user.id;
    const { oldPassword, newPassword, confirmNewPassword } = request.payload;

    const queryUser = await db.collection('users').doc(id);
    const dataUser = await queryUser.get()

    //verifikasi apakah user ada
    if(!dataUser.exists){
        return h.response({
            status:'fail',
            message:'User tidak ditemukan',
            data:null
        }).code(404);
    }

    //verifikasi password lama
    const isMatch = await bcrypt.compare(oldPassword, dataUser.data().password);

    //jika salah
    if (!isMatch) {
      return h.response({ 
        status:'fail',
        message:{
          errors: {
            oldPassword:'Password lama salah'
          }
        },
        data:null
      }).code(401);
    }

    //membuat enkripsi password
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    //update password user
    await queryUser.update({
        password:hashedNewPassword
    });

    return h.response({ 
      status:'success',
      message: 'Password berhasil diubah',
      data:null 
    }).code(200);

}

export default updatepassword