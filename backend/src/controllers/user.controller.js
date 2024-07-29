import { asyncHandler } from '../utils/asyncHandler.js'
import { APIError } from '../utils/APIError.js';
import { User } from '../models/user.model.js';
import uploadOnCloudinary from '../utils/FileUploadCloudinary.js';
import { APIResponce } from '../utils/APIResponce.js';
import jwt from 'jsonwebtoken';

//this method for genrating refresh token and access token

const genrateAccessAndRefreshToken = async (userId) => {
    try {
        //find user 
        // console.log(userId);
        const user = await User.findById(userId);

        //genrate tokens
        const accessToken = user.genrateAccessToken();
        const refreshToken = user.genrateRefreshToken();

        //store tokens to db 
        user.refreshToken = refreshToken;
        //save method update db and validateBeforeSave:false is given because we are updating only single value thats why it calls mongoose moduls like require like 
        //so we give validateBeforeSave:false it save/update  data without validation  
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken }

    } catch (error) {
        throw new APIError(500, 'Somthing went Wrong while Genrating Access and Resfresh token');
    }
};


const registerUser = asyncHandler(async (req, res) => {

    /*1.get user details from frontend
     2.validate data- check empty
     3. check if user already exist (email,username)
     4. files exist or nat (avatar(compalsory),coverimg)
     5. upload images to cloudinary
     6. check avatar uploded successfully
     7. create user object (mondodb obj) - create entry in db
     8.check user creation
     9. remove password & refresh token(  after user creation(storing to db) we get responce in that all data we get )
     10. return responce
    */

    // 1.get user details from frontend
    const { fullName, email, username, password } = req.body
    // console.log(req.files);

    // 2.validate data- check empty
    /*if(fullName===''){
        throw new APIError(400,'Full Name is Required')
    }*/

    if (
        [fullName, email, username, password].some((field) => field?.trim() === '')
    ) {
        throw new APIError(400, 'All fields are require')
    }


    // 3. check if user already exist (email,username)
    // below checking user is already exist or not on the basis of email& username so $or operator is used
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new APIError(409, 'User with email or usernmae already exist!!!')
    }


    // 4. files exist or nat (avatar(compalsory),coverimg)

    const coverImageFile = req.files?.coverImage[0];

    //multer (middleware give this access to files )
    //in that we get array of that file and we are takaing llocal path from that 

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const coverImageLocalPath = coverImageFile ? coverImageFile.path : null;

    if (!avatarLocalPath) {
        throw new APIError(400, 'Avatar file Required')
    }


    // 5. upload images to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log(coverImage);
    if (!avatar) {
        throw new APIError(400, 'Avatar file Required')
    }


    // 7. create user object (mondodb obj) - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',     //if cover image if available then upload url or empty
        email,
        password,
        username: username.toLowerCase()
    })

    //8.check user creation
    // 9. remove password & refresh token

    //firstly checking user is creted or not by using _id after that
    // select  method is used to specify which field whant to exclude or include  
    // syntax is unique like i wnat to exclude password and refreshtoken so - sign is given and fields are seprated by space
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new APIError(500, 'Something is went wrong while Registering the User')
    }

    return res.status(201).json(
        new APIResponce(200, createdUser, "User Registered Successfully")
    )

});

const loginUser = asyncHandler(async (req, res) => {
    /*
        1.get credientails
        2.validate credientails (email-username)
        3.find user
        4.password check
        5.set access and refresh token
        6.send cookies 
    */

    // 1.get credientails
    const { email, username, password } = req.body
    console.log(email);
    // 2.validate credientails (email-username)

    // for compasory email & usename
    // if(!email && !username){
    //     throw new APIError(400,'Username & Email Required!!!')
    // }

    if (!(email || username || password)) {
        throw new APIError(400, 'Username & Password Required!!!')
    }

    // 3.find user
    // User.findOne() this method is mongoose buildin methods 
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new APIError(404, 'User not Found!!!')
    }

    //4.password check
    // for this we created methods to check password in user.module schema  
    //to access these method we need to use user not User
    //User is mongodb object
    //user is our object in that 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new APIError(401, 'Invalid user Credintials!!!')
    }

    // 5.set access and refresh token
    const { refreshToken, accessToken } = await genrateAccessAndRefreshToken(user._id);


    // 6.send cookies 
    // this db call is expensive because if i use old userobject in that refreshtoken and accesstoken are empty 
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
    // console.log(loggedInUser);
    //cookie options - by default cookie can modified at client side 
    //so this options are require to prevent from modification on clinet side but from server side we can modify
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new APIResponce(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully..."
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    //req.user our object add from auth.middleware
    // console.log(req.user);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            //$_set is a mongodb opertor - give object to update values in db 
            $set: {
                refreshToken: undefined
            }

        },
        {
            //this new option is there this provide updated db object in return refrance
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'  //Adding sameSite: 'Strict' to prevent CSRF attacks.
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new APIResponce(200, {}, "User  Logged Out Successfully!!!"))
});

//this controller for taking new accesstoken from server 
//accesstoken expiry is limited thats why if user is active at that time accesstoken expiried then that automatically 
// new accesstoken get to user in background so this endpoint is required 

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new APIError(401, 'Unauthorized Request')
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new APIError(401, 'Invalid Refresh Token')
        }

        //incoomingRT is fromuser cide
        //user.refreshT is frm current user data from db

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new APIError(401, 'Refresh token is expired or used')
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { newRefreshToken, newAccessToken } = await genrateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie('accessToken', newRefreshToken)
            .cookie('refreshToken', newAccessToken)
            .json(new APIResponce(200, { newAccessToken, newRefreshToken }, 'Access Token Refreshed...'))

    } catch (error) {
        throw new APIError(401, error?.message || 'Invalid Refresh Token')
    }
});


const changeCurrectPassword = asyncHandler(async(req,res)=>{

    //user logged in or not checked by middleware

    const {oldPassword,newPassword}=req.body;
    
    /*const {oldPassword,newPassword,confPassword}=req.body;
    if(newPassword!==confPassword){
        throw new APIError(400,'New Password and Confirm Password  not Match')
    }*/

    //loggedin user from request.user from middleware set new object current user
    const user= await User.findById(req.user?._id);

    // check password oldpass is correct or not using predefined method in user.model
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new APIError(400,'Invalid ')
    }

    //set new password
    
    
    user.password=newPassword
    //this line execute then in user.model file pre method trigger 
    await user.save({validateBeforeSave:false})

    return res
        .status(200)
        .json(new APIResponce(200,"Password Change Succesfully..."))

});

const getCurrectUser = asyncHandler(async(req,req)=>{
    return res
        .status(200)
        .json(200,req.user,"Currunt User Fetch Successfully...")
});

//in this controller only updating text data because in produiction level new controller is created  for file data update like image for low congestion
//this controller require auth middlware
const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName, email } = req.body;

    if(!fullName || !email){
        throw new APIError('400',"All field are required!!!")
    }

    const user= await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                //both are same es6
                fullName:fullName,
                email
            }
        },
        {new:true}
    ).select('-password -refreshToken')

    return res
        .status(200)
        .json(new APIResponce(200,user,"Account Details Updated Successfully..."))
});


//for this controller two middleware req auth for current user login and multer for upload new file
const updateUserAvatar = asyncHandler(async(req,res)=>{
    //req.file this object available from middlware
    const newAvatarLocalPath=req.file?.path;


    if(!newAvatarLocalPath){
        throw new APIError(400,'Avatar file is Missing!!!')
    }
    const avatarUrl= await uploadOnCloudinary(newAvatarLocalPath);
    if(!avatarUrl.url){
        throw new APIError(500,'Error While Uploding Avatar!!!')
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatarUrl.url
            }
        },
        {new:true}
    ).select('-password -refreshToken')

    return res
        .status(200)
        .json(200,user,'Avatar Image Updated Successfully...')
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    //req.file this object available from middlware
    const newCoverImageLocalPath=req.file?.path;


    if(!newCoverImageLocalPath){
        throw new APIError(400,'Cover Image File is Missing!!!')
    }
    const coverImageUrl= await uploadOnCloudinary(newCoverImageLocalPath);
    if(!coverImageUrl.url){
        throw new APIError(500,'Error While Uploding Cover Image!!!')
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage:coverImageUrl.url
            }
        },
        {new:true}
    ).select('-password -refreshToken')

    return res
        .status(200)
        .json(200,user,'Cover Image Updated Successfully...')
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrectPassword,
    getCurrectUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,

};