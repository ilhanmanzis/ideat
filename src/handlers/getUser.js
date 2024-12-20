import db from "../config/db.js"

const getUser = async(request,h)=>{
    const id = request.user.id;
    
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
    const user = dataUser.data();
    return h.response({
        status:'success',
        message:'Data profil berhasil didapatkan',
        data: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            jenisKelamin: user.jenis_kelamin,
            tanggalLahir: user.tanggal_lahir,
            beratBadan: user.berat_badan,
            tinggiBadan: user.tinggi_badan,
        }
    }).code(200);
}

export default getUser;