import {asyncHandler} from '../utils/asyncHandler.js'
import {APIError} from '../utils/APIError.js';
import { User } from '../models/user.model.js';
import uploadOnCloudinary from '../utils/FileUploadCloudinary.js';
import { APIResponce } from '../utils/APIResponce.js';


const registerUser=asyncHandler(async(req,res)=>{

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
    const {fullName,email,username,password}=req.body
    // console.log(req.files);

    // 2.validate data- check empty
    /*if(fullName===''){
        throw new APIError(400,'Full Name is Required')
    }*/

    if(
        [fullName,email,username,password].some((field)=>field?.trim()==='')
    ){
        throw new APIError(400,'All fields are require')
    }
    

    // 3. check if user already exist (email,username)
    // below checking user is already exist or not on the basis of email& username so $or operator is used
    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new APIError(409,'User with email or usernmae already exist!!!')
    }


    // 4. files exist or nat (avatar(compalsory),coverimg)

    const coverImageFile=req.files?.coverImage[0];

    //multer (middleware give this access to files )
    //in that we get array of that file and we are takaing llocal path from that 
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const coverImageLocalPath=coverImageFile?coverImageFile.path:null;
    
    if(!avatarLocalPath){
        throw new APIError(400,'Avatar file Required')
    }


    // 5. upload images to cloudinary

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    // console.log(coverImage);
    if(!avatar){
        throw new APIError(400,'Avatar file Required')
    }


    // 7. create user object (mondodb obj) - create entry in db
    const user= await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '' ,     //if cover image if available then upload url or empty
        email,
        password,
        username:username.toLowerCase()
    })

    //8.check user creation
    // 9. remove password & refresh token

    //firstly checking user is creted or not by using _id after that
    // select  method is used to specify which field whant to exclude or include  
    // syntax is unique like i wnat to exclude password and refreshtoken so - sign is given and fields are seprated by space
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new APIError(500,'Something is went wrong while Registering the User')
    }

    return res.status(201).json(
        new APIResponce(200, createdUser,"User Registered Successfully")
    )

})

export {registerUser};