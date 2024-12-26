import db from "../config/db.js";

const getHistoryById = async(request, h)=>{
    const idUser = request.user.id;
    const idHistory = request.params.idHistory;

    //mencari history dengan id yang diberikan
    const queryHistory = await db.collection('users').doc(idUser).collection('history').doc(idHistory);

    //mendapatkan data history
    const snapshot = await queryHistory.get();

    //verifikasi apakah data ada atau tidak
    if(!snapshot.exists){
        console.log(`History dengan ID ${idHistory} untuk user ${request.user.email} tidak ditemukan.`);

        return h.response({
            status: 'fail',
            message: {  
                errors:{
                    history:`History dengan ID ${idHistory} tidak ditemukan.`
                }
            },
            data: null
        }).code(404);
    }

    //data ditemukan
    const history = snapshot.data();
    return h.response({
        status:'success',
        message:'Data history berhasil ditemukan',
        data:{
            ...history
        }
    }).code(200);
}

export default getHistoryById;