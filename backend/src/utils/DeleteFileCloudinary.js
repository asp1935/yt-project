import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


 const deletefromCloudinary = async (fileURL) => {
    try {
        const publicId = fileURL.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(publicId, function (error, result) {
            if (error) {
                console.log(error.message);
                return null;
            }
            console.log("Result:", result);
        });

    } catch (error) {
        console.log(error?.msg);
        return null;
    }
}
export default deletefromCloudinary;