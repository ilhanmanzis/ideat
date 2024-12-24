import db from "../config/db.js";

const saveFireStore = async(idUser, idHistory, historyData)=>{
    try {
        const userDoc = await db.collection('users').doc(idUser);


        const historyCollection =await userDoc.collection('history');
        const historyDoc = await historyCollection.doc(idHistory);

         // Menyimpan data ke Firestore
        await historyDoc.set(historyData);
    } catch (error) {
        console.error("Error saat menyimpan data:", error.message);
    }
}

export default saveFireStore;