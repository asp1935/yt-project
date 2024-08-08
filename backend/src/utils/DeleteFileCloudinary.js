import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


 const deletefromCloudinary = async (fileURL) => {
    try {
         // Extract the public ID from the URL
         const publicId = fileURL.split('/').pop().split('.')[0];

 
         // Determine resource type
         const fileType = fileURL.split('.').pop();
         const resourceType = (fileType === 'mp4') ? 'video' : 'image';
 
         // Destroy the resource on Cloudinary
         const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
         console.log("Result:", result);

    } catch (error) {
        console.log(error?.msg);
        return null;
    }
}

export default deletefromCloudinary;