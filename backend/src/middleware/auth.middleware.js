import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

//this middlware used to check is there user there or not 
//on the basis of token we are verifying
// async(req,res,next) in this we are not using res then we can user _ insted of res 
export const verifyJWT=asyncHandler(async(req,_,next)=>{
   try {
     //taking cookies from req if not available if there is mobile app then taking from custom header
     //Authorization is key in header
     //and value format is Bearer <token> so extract vthat token
     const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','');
  
     if(!token){
         throw new APIError(401,"Unauthorized Request")
     }
     
     //check token is correct or not using JWT and whats inside in that token
     //jwt verify method is used to verify and decode that token but we need to pass ACCESS_TOKEN_SECRET
     const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

     //in that decodedAccesstoken there it is given 
     const user = await User.findById(decodedToken._id).select('-password -refreshToken');
     if(!user){
         throw new APIError(401,'Invalid Access Token!!!')
     }
     
     //main part adding new object in req
     req.user=user;
     next();
   } catch (error) {
        throw new APIError(401,error?.message || "Invalid Access Token")
   }

})