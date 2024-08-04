import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweet } from "../controllers/tweet.controller.js";

const router=Router();

router.use(verifyJWT);      // Apply verifyJWT middleware to all routes in this file


router.route('/create-tweet').post(createTweet);
router.route('/get-tweets').post(getUserTweet);
router.route('/delete-tweet/:tweetId').delete(deleteTweet);


export default router;