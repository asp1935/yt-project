import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideoDetails, updateVideoThumbnail } from "../controllers/video.controller.js";

const router = Router();



router.route('/publish-video').post(upload.fields(
    [
        {
            name: 'videoFile',
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]),
    verifyJWT,
     publishVideo);
router.route('/get-videos').get(getAllVideos);
router.use(verifyJWT);
router.route('/get-videoby-id/:videoId').get(getVideoById);
router.route('/update-video-details/:videoId').patch(updateVideoDetails);
router.route('/update-video-thumbnail/:videoId').patch(upload.single('thumbnail'),updateVideoThumbnail);
router.route('/delete-video/:videoId').delete(deleteVideo);
router.route('/toggle-publish-status/:videoId').patch(togglePublishStatus);
    
export default router;