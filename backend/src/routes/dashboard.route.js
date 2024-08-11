import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getChannelVideos, getrChannelStats } from "../controllers/dashboard.controller.js";


const router=Router();

router.use(verifyJWT);

router.route('/channel-stats').get(getrChannelStats);
router.route('/channel-videos').get(getChannelVideos);

export default router;
