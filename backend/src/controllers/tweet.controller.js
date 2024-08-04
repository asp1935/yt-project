import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { APIError } from "../utils/APIError.js";
import { APIResponce } from "../utils/APIResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTweet = asyncHandler(async (req, res) => {
    //to create new tweet

    const { content } = req.body;

    if (content === '') {
        throw new APIError(400, 'Tweet Content Required!!!')
    }

    const createdTweet = await Tweet.create({
        content,
        tweetOwner: req.user?._id
    });

    if (!createdTweet) {
        throw new APIError(500, 'Something wend wrong while posting tweet!!!')
    }
    console.log(createdTweet);

    return res
        .status(200)
        .json(new APIResponce(200, createdTweet, 'Tweet Posted...'));

});

const getUserTweet = asyncHandler(async(req,res)=>{
    const tweets=await Tweet.aggregate([
        {
            $match:{
                tweetOwner:new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:'users',
                localField:'tweetOwner',
                foreignField:'_id',
                as:'tweetOwner',
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                tweetOwner:{$first:"$tweetOwner"}
            }
        },
        {
            $addFields:{
                fullName:"$tweetOwner.fullName",
                username:"$tweetOwner.username",
                avatar:"$tweetOwner.avatar"
            }
        },
        {
            $project:{
                _id:1,
                fullName:1,
                username:1,
                content:1,
                avatar:1,
                createdAt:1

            }
        }
    ]);
    if(!tweets){
        throw new APIError(500,'Something went wrong while fetching ')
    }

    // console.log(tweets);
    return res
        .status(200)
        .json(new APIResponce(200,tweets,'User Tweets'))
});





export {
    createTweet,
    getUserTweet,
    
}
