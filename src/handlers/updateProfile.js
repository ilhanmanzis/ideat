import db from "../config/db.js";

const updateProfile = async(request, h)=>{
    const id = request.user.id;
    const { nama, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan } = request.payload;

     //mencari user berdasarkan id
    const queryUser = await db.collection('users').doc(id);
    const dataUser = await queryUser.get();

    //verifikasi apakah user ada
    if(!dataUser.exists){
        return h.response({
            status:'fail',
            message:'User tidak ditemukan',
            data:null
        }).code(404);
    }
    //user ditemukan
    await queryUser.update({
        nama:nama || dataUser.data().nama,
        jenisKelamin:jenisKelamin || dataUser.data().jenisKelamin,
        tanggalLahir:tanggalLahir || dataUser.data().tanggalLahir,
        tinggiBadan:tinggiBadan || dataUser.data().tinggiBadan,
        beratBadan:beratBadan || dataUser.data().beratBadan,
    });

    return h.response({
        status:'success',
        message:'Profile user berhasil diperbarui',
        data:null
    }).code(200);
};

export default updateProfile;