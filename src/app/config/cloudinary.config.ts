import { v2 as cloudinary } from "cloudinary";
import { envVariables } from "./env";

console.log("Cloudinary Config File" , envVariables.CLOUDINARY.CLOUDINARY_API_KEY);

cloudinary.config ({

    cloud_name : envVariables.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key : envVariables.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret : envVariables.CLOUDINARY.CLOUDINARY_API_SECRET
 
})

export const CloudinaryUpload = cloudinary ; 
