import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'    //file system package available in node already

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary= async(localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file cloudinary
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto'
        })
        //file uploaded successfully
        console.log('File is uploded on cloudinary',responce.url);
        //remove locally stored file from our  server
         fs.unlinkSync(localFilePath)
        return responce;

    } catch (error) {
        //if file not uploaded then remove that file from our server
        //unlinkSync method execue compulsory
        fs.unlinkSync(localFilePath)
        return null;
    }
}


export default uploadOnCloudinary
