import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/FileUploadCloudinary.js";
import { Video } from "../models/video.model.js";
import { APIResponce } from "../utils/APIResponce.js";
import mongoose, { isValidObjectId } from "mongoose";
import deletefromCloudinary from "../utils/DeleteFileCloudinary.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;




    const pipeline = [];

    pipeline.push({
        $match: {
            isPublished: true
        }
    });

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new APIError(400, 'Invalid User Id');
        }
        pipeline.push(
            {
                $match: {
                    videoOwner: new mongoose.Types.ObjectId(userId)
                },
            }
        );
    }

    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    {
                        title: {
                            $regex: query,
                            $options: 'i'
                        }
                    }, {
                        description: {
                            $regex: query,
                            $options: 'i'
                        }
                    }
                ]
            }
        });
    }

    //sortBy means views,like,duration,createdAt
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === 'asc' ? 1 : -1,
            },
        });
    }



    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'videoOwner',
            foreignField: '_id',
            as: 'videoOwnerDetails',
            pipeline: [
                {
                    $project: {
                        fullName: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    }, {
        $unwind: '$videoOwnerDetails'
    });

    // const allVideos =await Video.aggregate(pipeline);

    // if(!allVideos){
    //     throw new APIError(500,'Somthing went wrong while featching Videos!!!');
    // }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    const paginatedVideos = await Video.aggregatePaginate(pipeline, options);

    if (!paginatedVideos) {
        throw new APIError(500, 'Something went wrong while Paginating Videos!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, paginatedVideos, 'Successfully Video Fetched...'))




});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid video ID!!!');
    }

    const singleVideo = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'video',
                as: 'likes'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'videoOwner',
                foreignField: '_id',
                as: 'videoOwner',
                pipeline: [
                    {
                        $lookup: {
                            from: 'subscriptions',
                            localField: '_id',
                            foreignField: 'channel',
                            as: 'subscribers',

                        }
                    },
                    {
                        $addFields: {
                            subscriberCount: {
                                $size: '$subscribers'
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [req.user?._id, '$subscribers.subsciber']
                                    },
                                    then: true,
                                    else: false,
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            fullname:1,
                            username:1,
                            avatar:1,
                            subscriberCount:1,
                            isSubscribed:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                likeCount:{
                    $size:'$likes'
                },
                videoOwner:{
                    $first:'$videoOwner'
                },
                isLiked:{
                    $cond:{
                        if:{
                            $and: [
                                { $in: [new mongoose.Types.ObjectId(videoId), '$likes.video'] },
                                { $in: [req.user?._id, '$likes.likeBy'] }
                            ]
                            
                        },
                        then:true,
                        else:false
                    }   
                }
            }
        },
        {
            $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                description:1,
                duration:1,
                views:1,
                videoOwner:1,
                likeCount:1,
                isLiked:1,
                updatedAt:1
                
            }
        }
    ]);

    if (!singleVideo || singleVideo.length === 0) {
        throw new APIError(500,'Something Went wrong while fetching video!!!');
    }
    return res
        .status(200)
        .json(new APIResponce(200,singleVideo,'Successfully Fetched Video...'))

});

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!(title && description)) {
        throw new APIError(400, 'Title & Description Required!!!');
    }

    const videoLocalFilePath = req.files?.videoFile[0]?.path;
    const thumbnailLoaclFilePath = req.files?.thumbnail[0]?.path;

    if (!(videoLocalFilePath && thumbnailLoaclFilePath)) {
        throw new APIError(400, 'Video & Thumbnail File Required!!!');
    }

    const videoUrl = await uploadOnCloudinary(videoLocalFilePath);
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLoaclFilePath);
    // console.log(videoUrl);

    const video = await Video.create({
        title,
        description,
        videoFile: videoUrl?.url,
        thumbnail: thumbnailUrl?.url,
        videoOwner: req.user?._id,
        duration: videoUrl?.duration
    });

    if (!video) {
        throw new APIError(500, 'Something went wrong while publishing Video!!!')
    }

    return res
        .status(200)
        .json(new APIResponce(200, video, 'Video Published Successfully...'))



});

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid Video Id!!!');
    }
    const { title, description } = req.body;

    if (!(title || description)) {
        throw new APIError(400, 'Title or Description Required to Update !!!');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIError(404, 'Video not Found!!!');
    }
    if (video?.videoOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!');
    }

    const updateVideo = await Video.findByIdAndUpdate(video._id, {
        $set: {
            title,
            description,
        }
    }, { new: true })

    if (!updateVideo) {
        throw new APIError(500, 'Something went wrong while updating video!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, updateVideo, 'Video Details Updated Successfully...'));
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid Video Id!!!');
    }
    const newThumbnailLocalFilePath = req.file?.path;
    if (!newThumbnailLocalFilePath) {
        throw new APIError(400, 'Thumbnail is Required!!!');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIError(404, 'Video not Found!!!');
    }
    if (video.videoOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!');
    }

    const newThumbnailUrl = await uploadOnCloudinary(newThumbnailLocalFilePath);
    if (!newThumbnailLocalFilePath) {
        throw new APIError(500, 'Something went wrong while Uploading Thumbnail File!!!');
    }

    const updateVideo = await Video.findByIdAndUpdate(video._id, {
        $set: {
            thumbnail: newThumbnailUrl?.url,
        }
    }, { new: true });

    if (!updateVideo) {
        throw new APIError(500, 'Something went wrong while updating thumbnail!!!');
    }

    await deletefromCloudinary(video?.thumbnail);

    return res
        .status(200)
        .json(new APIResponce(200, updateVideo, 'Thumbnail Successfully Updated...'))

});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid Video ID!!!');
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIError(404, 'Video not Found!!!');
    }
    if (video?.videoOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access !!!');
    }

    const deletedVideo = await Video.findByIdAndDelete(video._id);
    if (!deletedVideo) {
        throw new APIError(500, 'Something went wrong while deleting video!!!');
    }
    await deletefromCloudinary(deletedVideo?.videoFile);
    await deletefromCloudinary(deletedVideo?.thumbnail);
    return res
        .status(200)
        .json(new APIResponce(200, deletedVideo, 'Video Deleted Successfully!!!'))





});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid Video ID!!!');
    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new APIError(404, 'Video not Found!!!');
    }

    if (video?.videoOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!');
    }

    const videoPublishStatusUpdate = await Video.findByIdAndUpdate(video._id,
        {
            $set: {
                isPublished: !video.isPublished,
            },
        },
        {
            new: true
        }
    ).select('isPublished');

    if (!videoPublishStatusUpdate) {
        throw new APIError(500, 'Something went wrong while updating status!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, videoPublishStatusUpdate, 'Status Updated...'))


});

export {
    getAllVideos,
    getVideoById,
    publishVideo,
    updateVideoDetails,
    updateVideoThumbnail,
    deleteVideo,
    togglePublishStatus,
}