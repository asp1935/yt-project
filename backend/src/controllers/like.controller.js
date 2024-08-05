import mongoose, { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { APIResponce } from '../utils/APIResponce.js';
import { Like } from '../models/like.model.js';


const toggelVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid Video Id!!!')
    }

    const alreadyLike = Like.findOne({
        video: videoId,
        likeBy: req.user?._id
    })

    if (alreadyLike) {
        await Like.findByIdAndDelete(alreadyLike?._id);

        return res
            .status(200)
            .json(new APIResponce(200, { isLiked: false }, 'Video Unliked'))
    }

    const videoLike = await Like.create({
        video: videoId,
        likeBy: req.user?._id
    });

    if (!videoLike) {
        throw new APIError(500, 'Something wend wrong while liking video!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, videoLike, 'Video Liked...'))


});

const toggletweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new APIError(400, 'Invalid Tweet Id!!!');
    }

    const alreadyLike = await Like.findOne({
        tweet: tweetId,
        likeBy: req.user?._id
    });

    if (alreadyLike) {
        const like = await Like.findByIdAndDelete(alreadyLike._id);
        // console.log(like);

        return res
            .status(200)
            .json(new APIResponce(200, { isLiked: false }, 'Tweet Unliked...'))
    }

    const tweetLike = await Like.create({
        tweet: tweetId,
        likeBy: req.user?._id
    });

    if (!tweetLike) {
        throw new APIError(500, 'Something went wrong while Liking Tweet!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, tweetLike, 'Tweet Liked...'))

});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new APIError(400, 'Invalid Comment Id!!!');
    }

    const alreadyLiked = await Like.findOne({
        comment: commentId,
        likeBy: req.user?._id
    });

    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);

        return res
            .status(200)
            .json(new APIResponce(200, { isLiked: false }, 'Tweet Uliked...'))
    }

    const commentLike = await Like.create({
        comment: commentId,
        likeBy: req.user?._id
    });

    if (!commentLike) {
        throw new APIError(500, 'Something Went wrong while liking comment!!!');
    }
    return res
        .status(200)
        .json(200, commentLike, 'Comment Liked...')
});
const getLikedVideos = asyncHandler(async (req, res) => {
    const { userId } = req.user?._id;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likeBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:'videos',
                localField:'video',
                foreignField:'_id',
                as:'likedVideos',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'videoOwner',
                            foreignField:'_id',
                            as:'ownerDetails',

                        }
                    },
                    {
                        $addFields:{
                            ownerDetails:{
                                $first:'$ownerDetils'
                            }
                        }
                    },
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
                likedVideos:{
                    $first:'$likedVideos'
                }
            }
        },
        
    ])

    if(!likedVideos){
        throw new APIError(500,'Somthing went wrong while fetching liked videos!!!');
    }
    return res  
        .status(200)
        .json(new APIResponce(200,likedVideos,'Liked Videos...'))
});


export {
    toggelVideoLike,
    toggletweetLike,
    toggleCommentLike,
    getLikedVideos,
}