import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Request } from "express";
import { envVariables } from "./env";
import { CloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: CloudinaryUpload,
  params: {
    public_id: (req: Request, file: Express.Multer.File) => {
        // console.log("Cloudinary Config File" , envVariables.CLOUDINARY.CLOUDINARY_API_KEY);
      const cleanName = file.originalname
        .toLowerCase()
        .replace(/[\s.]+/g, "-")
        .replace(/[^a-z0-9-]+/g, "");
      const extention = file.originalname.split(".").pop();

            const unicFilename = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + cleanName + "." + extention

            return unicFilename
    },
  },
});

export const multerUpload = multer({ storage : storage });
