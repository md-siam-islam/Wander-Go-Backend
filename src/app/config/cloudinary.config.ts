import { v2 as cloudinary } from "cloudinary";
import { envVariables } from "./env";

console.log("Cloudinary Config File" , envVariables.CLOUDINARY.CLOUDINARY_API_KEY);

cloudinary.config ({

    cloud_name : envVariables.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key : envVariables.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret : envVariables.CLOUDINARY.CLOUDINARY_API_SECRET
 
})


export const deleteImageFromCloudinary = async (url : string) => {

   try {
       const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
       const match = url.match(regex);

       console.log("Matched URL:", match);

       if (match && match[1]) {
           const publicId = match[1];
           await cloudinary.uploader.destroy(publicId);
           console.log(`File ${publicId} is deleted from cloudinary`);
       }
   } catch (error) {
       console.error("Error deleting file from cloudinary:", error);
   }
}

export const CloudinaryUpload = cloudinary;