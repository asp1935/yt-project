import {Router} from 'express';
import { changeCurrectPassword, getCurrectUser, getUserchannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from '../controllers/user.controller.js';
import {upload} from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router=Router();
router.route("/register").post(
    //middleware is used to store files on server folder 
    // field method for multiple files 
    upload.fields([ 
        {
            name: "avatar",   //name from frontend 
            maxCount: 1       // no of image (we can give array of images )
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    
    registerUser
);      //url will be===http://localhost:3000/api/v1/users/register

router.route("/login").post(loginUser);


//secured Routes

router.route("/logout").get(verifyJWT, logoutUser);      // midddleware added  
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrectPassword);
router.route("/current-user").get(verifyJWT,getCurrectUser);
router.route("/update-account-details").patch(verifyJWT,updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT,upload.single('avatar'),updateUserAvatar);
router.route("/update-cover-image").patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage);
//we are taking usernme from params thats why :username
router.route("/channel/:username").get(verifyJWT,getUserchannelProfile);
router.route("/history").get(verifyJWT,getWatchHistory);

export default router;