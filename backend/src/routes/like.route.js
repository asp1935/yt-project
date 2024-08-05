import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getLikedVideos, toggelVideoLike, toggleCommentLike, toggletweetLike } from "../controllers/like.controller.js";


const router=Router();

router.use(verifyJWT);

router.route('/video-like/:videoId').get(toggelVideoLike);
router.route('/tweet-like/:tweetId').get(toggletweetLike);
router.route('/comment-like/:commentId').get(toggleCommentLike);
router.route('/liked-videos').get(getLikedVideos);

export default router;