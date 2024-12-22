import db from "../config/db.js";

const getAllHistory = async(request, h)=>{
    const id = request.user.id;

    const queryHistory = await db.collection('users').doc(id).collection('history');
    const snapshot = await queryHistory.get();

    //verifikasi apakah data history ada/tidak
    if(snapshot.empty){
        console.log(`Data history user ${request.user.email} tidak ada`);
        return h.response({
            status:'fail',
            message:'Data history tidak ditemukan',
            data:null
        }).code(404);
    };

    //memproses data menjadi array dengan atribut yang diperlukan saja
    const historyes = snapshot.docs.map(doc=>{
        const {id_history, makanan, kalori, image } = doc.data();
        return {id_history, makanan, kalori, image } //hanya menyertakan atribut tertentu
    });

    return h.response({
        status:'success', 
        message:'Data history berhasil ditemukan',
        data:historyes
    }).code(200);
}
export default getAllHistory;