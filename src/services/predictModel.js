import axios from "axios";

const predictModel = async(image, base64Image)=>{
    const response = await axios.post(
        process.env.MODEL_URL,
        { image: `data:${image.headers['content-type']};base64,${base64Image}` },
        {
            headers:{
                "Content-Type": "application/json"
            }
        }
    )
    console.log(response.data);
    return response.data;
}

export default predictModel;