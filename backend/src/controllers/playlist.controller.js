import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { Playlist } from "../models/playlist.model.js";
import { APIResponce } from "../utils/APIResponce.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!(name && description)) {
        throw new APIError(400, 'Playlist Name and  Description Required!!!');
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        playlistOwner: req.user?._id
    });

    if (!newPlaylist) {
        throw new APIError(500, 'Something went wrong while creating Playlist!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, newPlaylist, 'Successfully Created New Playlist...'))

});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new APIError(400, 'Invalid User Id');
    }

    const playLists = await Playlist.aggregate([
        {
            $match: {
                playlistOwner: new mongoose.Types.ObjectId(userId)
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                totalVideos: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!playLists) {
        throw new APIError(500, 'sothing went wrong while Fetching Playlists!!!');
    }
    return res
        .status(200)
        .json(new APIResponce(200, playLists, 'Successfully fetched Playlist...'))

});

const getPlayListById = asyncHandler(async (req, res) => {
    const { playListId } = req.params;

    if (!isValidObjectId(playListId)) {
        throw new APIError(400, 'Invalid Playlist ID!!!')
    }

    const playlist = await Playlist.findById(playListId);
    if (!playlist) {
        throw new APIError(404, 'Playlist Not Exist!!!');
    }

    const playlistVideos = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlist?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: 'videos',
                pipeline: [
                    {
                        $match: {
                            "isPublished": true,
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
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            videoOwner: {
                                $first: '$videoOwner'
                            }
                        }
                    }
                ]
            }
        },

        {
            $lookup: {
                from: 'users',
                localField: 'playlistOwner',
                foreignField: '_id',
                as: 'playlistOwner',
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
        },
        {
            $addFields: {
                videos: {
                    $first: '$videos'
                },
                totalVideos: {
                    $size: "$videos"
                },
                playlistOwner: {
                    $first: "$playlistOwner"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                updatedAt: 1,
                videos: 1,
                totalVideos: 1,
                playlistOwner: 1,

            }
        }
    ]);

    if (!playlistVideos) {
        throw new APIError(500, 'Something went wrong while fetching Playlist!!!');
    }
    return res
        .status(200)
        .json(new APIResponce(200, playlistVideos, 'Successfully Fetched Playlist...  '))

});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (![playlistId, videoId].every(isValidObjectId)) {
        throw new APIError(400, 'Invalid Playlist ID or Video Id');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new APIError(404, 'Playlist not Found!!!');
    }
    if (playlist.playlistOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!')
    }
    // const video=await Video.findById(videoId);
    // if(!video){
    //     throw new APIError(404,'Video not Found!!!')
    // }
    if (!playlist.videos.includes(videoId)) {
        return res
            .status(200)
            .json(new APIResponce(200, 'Video Already Added...'))
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $addToSet: {
                videos: videoId
            }
        }, { new: true }
    );

    if (!updatePlaylist) {
        throw new APIError(500, 'Something went wrong while adding video!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, updatedPlaylist, 'Successfully Added Video...'))



});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (![playlistId, videoId].every(isValidObjectId)) {
        throw new APIError(400, 'Invalid Playlist ID or Video Id!!!');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new APIError(404, 'Playlist Not Found!!!');
    }
    if (playlist.playlistOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthoried Access!!!');
    }
    if (!playlist.videos.includes(videoId)) {
        return res
            .status(200)
            .json(new APIResponce(200, 'Video Already Removed...'))
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $pull: {
                videos: videoId,
            }
        }, { new: true }
    );

    if (!updatedPlaylist) {
        throw new APIError(500, 'Something went wrong while removing video from playlist!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, updatedPlaylist, 'Successfully video removed from playlist...'))


});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
        throw new APIError(400, 'Invalid Playlist Id!!!');
    }
    
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new APIError(404, 'Playlist not found!!!');
    }

    if (playlist.playlistOwner.toString() !== req.user._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!');
    }
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlist._id);

    if (!deletedPlaylist) {
        throw new APIError(500, 'Something went wrong while deleting Playlist!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, deletePlaylist, 'Successfully PlayList Deleted...'))

});



const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;
    const { name, description } = req.body;

    if(!isValidObjectId(playlistId)){
        throw new APIError(400,'Invalid Playlist ID!!!');
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new APIError(404, 'Playlist Not Found...');
    }

    const updatedName = name?.trim() ? name : playlist?.name;
    const updatedDescription = description?.trim() ? description : playlist?.description;

    const updatedPlaylist=await Playlist.findOneAndUpdate(
        playlist._id,
        {
            $set:{
                name:updatedName,
                description:updatedDescription
            }
        },{new:true}
    );

    if(!updatedPlaylist){
        throw new APIError(500,'Something went wrong While Updating Playlist!!!');
    }

    return res  
        .status(200)
        .json(new APIResponce(200,updatedPlaylist,'Successfully Updated Playlist...'))

});




export {
    createPlaylist,
    getUserPlaylists,
    getPlayListById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,


}