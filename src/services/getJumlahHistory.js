import db from "../config/db.js"

const getJumlahHistory = async(id)=>{
    const historyCollection = db.collection('users').doc(id).collection('history');
    try {
        const queryHistory = await historyCollection.get(historyCollection);
        console.log(queryHistory);
        console.log(queryHistory.size);
        return queryHistory.empty ? 0 : queryHistory.size;  // Menambahkan pengecekan jika subcollection kosong
    } catch (error) {
        console.error("Error getting documents: ", error);
        return 0;  // Jika terjadi error, return 0
    }

}

export default getJumlahHistory;