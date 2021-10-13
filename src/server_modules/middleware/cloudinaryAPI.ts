
import dotenv from 'dotenv';
import cloudinary from 'cloudinary'

dotenv.config();
export const cloudinaryAPI = cloudinary.v2;

cloudinaryAPI.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

