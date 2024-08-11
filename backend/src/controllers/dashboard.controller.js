import { mongoose } from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponce } from "../utils/APIResponce.js";
import { Video } from "../models/video.model.js";


const getrChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelID = req.user?._id;

    const channelStats=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(channelID)
            }
        },
        {
            $lookup:{
                from:'videos',
                let:{userId:'$_id'},
                pipeline:[
                    {
                        $match:{$expr:{$eq:['$videoOwner','$$userId']}}
                    },
                    {
                        $group:{
                            _id:null,
                            totalViews:{$sum:'$views'},
                            totalVideos:{$count:{}}
                        }
                    }
                ],
                as:'channelVideos'
            }
        },
        {
            $lookup:{
                from:'likes',
                let:{userId:'$_id'},
                pipeline:[
                    {
                        $match:{$expr:{$eq:['$likeBy','$$userId']}}
                    },
                    {
                        $group:{
                            _id:null,
                            totalLikes:{$sum:1}
                        }
                    }
                ],
                as:'totalLikes'
            }
        },
        {
            $lookup:{
                from:'subscribers',
                localField:'_id',
                foreignField:'channel',
                as:'totalSub',
                pipeline:[
                    {
                        $group:{
                            _id:null,
                            totalSub:{$sum:1}
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                totalViews:{$ifNull:[{$arrayElemAt:['$channelVideos.totalViews',0]},0]},
                totalVideos:{$ifNull:[{$arrayElemAt:['$channelVideos.totalVideos',0]},0]},
                totalLikes:{$ifNull:[{$arrayElemAt:['$totalLikes.totalLikes',0]},0]},
                totalSub:{$ifNull:[{$arrayElemAt:['$totalSub.totalSub',0]},0]}
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                avatar:1,
                totalVideos:1,
                totalLikes:1,
                totalSub:1,
                totalViews:1
            }
        }
    ])


    if(!channelStats){
        throw new APIError(500,'Something Went wrong while fetching Channel Statestics!!!');
    }
    return res
        .status(200)
        .json(new APIResponce(200,channelStats,'Successfully fetched Channel Statestics...'))

});


const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId=req.user?._id;
    
    const channelVideos=await Video.aggregate([
        {
            $match:{
                videoOwner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:'likes',
                localField:'_id',
                foreignField:'video',
                as:'likes',
                
            }
        },
        {
            $lookup:{
                from:'comments',
                localField:'_id',
                foreignField:'video',
                as:'comments',
            }
        },
        {
            $addFields:{
                likes:{
                    $size:'$likes'
                },
                comments:{
                    $size:'$comments'
                }
        
            }
        },
        {
            $project:{
                title:1,
                videoFile:1,
                thumbnail:1,
                duration:1,
                views:1,
                isPublished:1,
                likes:1,
                comments:1
            }
        }
        
    ]);


    if(!channelVideos){
        throw new APIError(500,'Something went wrong while fetching Videos!!!');
    }
    return res  
        .status(200)
        .json(new APIResponce(200,channelVideos,'Successfully Fetched Videos...'))
});

export {
    getChannelVideos,
    getrChannelStats,
}


    // const channelStats = await User.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(channelID)
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: 'videos',
    //             localField: '_id',
    //             foreignField: 'videoOwner',
    //             as: 'channelVideos',
    //             pipeline: [
    //                 {
    //                     $group: {
    //                         _id: null,
    //                         totalViews: {
    //                             $sum: '$views'
    //                         }
    //                     }
    //                 }
    //             ]
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:'likes',
    //             localField:'_id',
    //             foreignField:'likeBy',
    //             as:'totalLikes', 
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:'subscribers',
    //             localField:'_id',
    //             foreignField:'channel',
    //             as:'totalSubscribers'
    //         }
    //     },
    //     {
    //         $addFields:{
    //             channelVideos:{
    //                 $first:'channelVideos'
    //             },
    //             totalVideos:{
    //                 $size:'$channelVideos'
    //             },
    //             totalLikes:{
    //                 $size:'$totalLikes'
    //             },
    //             totalSubscribers:{
    //                 $size:'$totalSubscribers'
    //             }


    //         }
    //     },
    //     {
    //         $project:{
    //             fullName:1,
    //             username:1,
    //             avatar:1,
    //             totalViews:'$channelVideos.totalViews',
    //             totalVideos:1,
    //             totalLikes:1,
    //             totalSubscribers:1
    //         }
    //     }
    // ]);