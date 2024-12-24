import fs from "fs";
import predictModel from "../services/predictModel.js";
import renameMakanan from "../services/renameMakanan.js";
import { upload, getOrCreateBucket } from "../services/upload.js";
import getJumlahHistory from "../services/getJumlahHistory.js";
import saveFireStore from "../services/saveFirestore.js";
import getCurrentDate from "../services/currentDate.js";


const scan = async(request, h)=>{
    const {photo} = request.payload;
    if (!photo) {
        return h.response({
            status: 'fail',
            message: {
                errors:{photo:'Gambar tidak ditemukan'}
            },
            data:null
        }).code(400);
    }

    try {
        //validasi type file
        const validMimeTypes = ['image/jpeg', 'image/png'];
        if(!validMimeTypes.includes(photo.headers['content-type'])){
            return h.response({ status: 'fail', 
                message:{
                    errors:{
                        photo:'Format gambar tidak valid. Hanya mendukung JPEG/PNG.'
                    }
                },
                data:null  
            }).code(400);
        }

         // Baca file sebagai buffer
        const imageBuffer = fs.readFileSync(photo.path);

        // Konversi ke Base64
        const base64Image = imageBuffer.toString('base64');

        //prediksi ke model
        const hasil = await predictModel(photo, base64Image);

        if(hasil.confidence_score < 10){
            return h.response({
                status: 'fail',
                message: {
                    errors: { photo: 'Makanan tidak dikenali.' }
                },
                data: null
            }).code(400); 
        }

        //mengubah makanan sesuai eyd
        const namaMakanan = await renameMakanan(hasil.model_prediction);

        if(!namaMakanan){
            return h.response({
                status: 'fail',
                message: {
                    errors: { photo: 'Makanan tidak dikenali.' }
                },
                data: null
            }).code(400); 
        }

        //nama bucket
        const bucketName = process.env.BUCKET_NAME;

        const bucket = await getOrCreateBucket(bucketName);

        // upload gambar ke cloud storage
        const fileUrl = await upload(photo.path, bucket, request.user.id, photo.filename);
        const today = getCurrentDate();
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        //mencari jumlah history untuk dijadikan id
        const jumlahHistory = await getJumlahHistory(request.user.id);

        const idHistory = `${jumlahHistory + 1}`;
        //menyimpan data ke firestore
        const historyData = {
            id_history: idHistory,
            makanan:namaMakanan,
            kalori:hasil.calories,
            confidence_score: hasil.confidence_score,
            tanggal: today,
            jam:formattedTime,
            image: fileUrl,
        };

        await saveFireStore(request.user.id, idHistory, historyData);

         // Hapus file sementara setelah diproses
        fs.unlinkSync(photo.path);
        
        return h.response({
            status: 'success',
            message:'Gambar Berhasil Diprediksi',
            data:{
                makanan: namaMakanan,
                kalori: hasil.calories,
                confidence_score: hasil.confidence_score,
                image: fileUrl
            }
        }).code(200);
    } catch (error) {
         // Hapus file sementara jika ada error
        if (fs.existsSync(photo.path)) {
            fs.unlinkSync(photo.path);
        }

        console.error('Error selama pemrosesan:', error.message);
        return h.response({
            status: 'fail',
            message: {
                errors:{
                    photo:'Terjadi kesalahan selama pemrosesan gambar.'
                }
            },
            data: null,
        }).code(500);
    }
}

export default scan;