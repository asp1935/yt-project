import { APIResponce } from "../utils/APIResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck=asyncHandler(async(req,res)=>{
    return res
        .status(201)
        .json(new APIResponce(200,'Server is working fine...'))
});

export {healthCheck};