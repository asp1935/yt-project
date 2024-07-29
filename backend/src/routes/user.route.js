import {Router} from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js';
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

router.route("/logout").post(verifyJWT, logoutUser);      // midddleware added  
router.route("/refresh-token").post(refreshAccessToken);

export default router;