# Import library yang diperlukan
from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import get_file, load_img, img_to_array
from tensorflow import expand_dims
from tensorflow.nn import softmax
from numpy import argmax, max, array
from uvicorn import run
import pandas as pd
import os
import base64
import tempfile
from dotenv import load_dotenv

# Inisialisasi aplikasi FastAPI
app = FastAPI()

# Konfigurasi CORS untuk mengizinkan akses dari domain lain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Membuat model data untuk menerima gambar dalam format base64
class ImageData(BaseModel):
    image: str
    

# Mendapatkan path model dan data kalori dari .env
model_path = os.getenv("MODEL_PATH")
calories_data_path = os.getenv("CALORIES_DATA_PATH")

# Memuat model ML dan data kalori
model = load_model(model_path)
calories_df = pd.read_csv(calories_data_path)

# Mendefinisikan label kelas makanan
class_labels = array(["ayam bakar", "ayam_goreng", "ayam_pop", "bakso", "daging_rendang",
                "dendeng_batakok", "gado_gado", "grontol", "gulai_ikan", "gulai_tambsu",
                "gulai_tunjang", "lanting", "lumpia", "putu_ayu", "serabi_solo",
                "telur_balado", "telor_dadar", "wajik"])


# Endpoint utama
@app.get("/")
async def root():
    return {"message": "Selamat datang di API Pengenalan Makanan!"}

# Endpoint halaman kamera
@app.get("/camera/", response_class=HTMLResponse)
async def camera_page():
    # Mengembalikan halaman HTML dengan fungsi kamera
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Kamera Pengenalan Makanan</title>
        <style>
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            #result { margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Kamera Pengenalan Makanan</h2>
            <video id="video" width="640" height="480" autoplay></video>
            <br><br>
            <button id="snap">Ambil Foto</button>
            <canvas id="canvas" width="640" height="480" style="display:none"></canvas>
            <div id="result"></div>
        </div>

        <script>
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const snap = document.getElementById('snap');
            const result = document.getElementById('result');
            
            // Mengaktifkan kamera
            navigator.mediaDevices.getUserMedia({video: true})
                .then(stream => video.srcObject = stream)
                .catch(err => console.error("Error kamera:", err));

            snap.addEventListener('click', async () => {
                canvas.getContext('2d').drawImage(video, 0, 0);
                const imageData = canvas.toDataURL('image/jpeg');
                
                try {
                    const response = await fetch('/camera/capture/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({image: imageData})
                    });
                    const data = await response.json();
                    result.innerHTML = `
                        <h3>Hasil:</h3>
                        <p>Makanan: ${data.model_prediction}</p>
                        <p>Tingkat Keyakinan: ${data.confidence_score}%</p>
                        <p>Kalori: ${data.calories}</p>
                    `;
                } catch (error) {
                    result.innerHTML = 'Error memproses gambar';
                    console.error(error);
                }
            });
        </script>
    </body>
    </html>
    """

# Endpoint untuk memproses gambar yang diambil
@app.post("/camera/capture/")
async def capture_image(data: ImageData):
    try:
        # Decode gambar base64
        img_data = base64.b64decode(data.image.split(',')[1])
        
        # Menyimpan ke file sementara
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            tmp.write(img_data)
            temp_path = tmp.name

        # Memproses gambar untuk prediksi
        img = load_img(temp_path, target_size=(224, 224))
        img_array = img_to_array(img) / 255.0
        img_array = expand_dims(img_array, axis=0)

        # Melakukan prediksi menggunakan model
        predictions = model.predict(img_array)
        scores = softmax(predictions[0])

        # Mengkonversi nilai numpy ke tipe data Python
        prediction_class = str(class_labels[argmax(scores)])
        confidence = float(max(scores) * 100)
        confidence = round(confidence, 2)
        
        # Mendapatkan informasi kalori dari DataFrame
        calories = int(calories_df[calories_df['nama_makanan'] == prediction_class]['kalori'].values[0])

        # Menghapus file sementara
        Path(temp_path).unlink()

        # Mengembalikan hasil prediksi
        return {
            "model_prediction": prediction_class,
            "confidence_score": confidence,
            "calories": calories
        }
    except Exception as e:
        return {"error": str(e)}

# Menjalankan aplikasi
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Port default 8080
    try:
        run(app, host="127.0.0.1", port=port)
    except Exception as e:
        print(f"Error menjalankan server: {e}")