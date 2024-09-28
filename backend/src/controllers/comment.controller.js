import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from '../models/comment.model.js';
import { APIError } from "../utils/APIError.js";
import { APIResponce } from "../utils/APIResponce.js";
import mongoose, { isValidObjectId } from "mongoose";



const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'Invalid Video ID!!!');
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const paginatedVideoComment = await Comment.aggregatePaginate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'commentOwner',
                foreignField: '_id',
                as: 'commentOwnerDetails'
            }
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: 'likeDetails'
            },
        },
        {
            $sort: {
                createdAt: -1,
            }
        },
        {
            $addFields: {
                commentOwnerDetails: {
                    $first: '$commentOwnerDetails',
                },
                likeCount: {
                    $size: '$likeDetails'
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, '$likeDetails.likeBy'] },
                        then: true,
                        else: false
                    },
                },
            }
        },
        {
            $project: {
                content: 1,
                likeCount: 1,
                commentOwnerDetails: {
                    _id:1,
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                },
                isLiked: 1,
                updatedAt: 1,


            }
        }
    ],options);

   
    
    
    if (!paginatedVideoComment) {
        throw new APIError(500, 'Something went wrong while Paginating comment!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, paginatedVideoComment, 'Comments Fetch Successfully...'))

});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, 'vidoe Id Invalid!!!');
    }
    if (!content) {
        throw new APIError(400, 'Comment Content Required!!!');
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        commentOwner: req.user?._id
    });

    if (!comment) {
        throw new APIError(500, 'Something went wrong while adding comment!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, comment, 'Comment Added...'))

});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new APIError(400, 'Invalid Comment Id!!!');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new APIError(404, 'Comment Not Found!!!');
    }

    if (comment?.commentOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!');
    }
    const updatedComment = await Comment.findByIdAndUpdate(comment._id, {
        $set: {
            content
        }
    }, { new: true });

    if (!updatedComment) {
        throw new APIError(500, 'Something went wrong while updating comment!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, updatedComment, 'Comment successfully updated...'))
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new APIError(400, 'Invalid Comment ID!!!');
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new APIError(404, 'Comment not found!!!');
    }
    if (comment?.commentOwner.toString() !== req.user?._id.toString()) {
        throw new APIError(401, 'Unauthorized Access!!!');
    }
    const deletedComment = await Comment.findByIdAndDelete(comment?._id);
    if (!deletedComment) {
        throw new APIError(500, 'Something went wrong while deleting commnet!!!');
    }
    return res
        .status(200)
        .json(new APIResponce(200, deletedComment, 'Comment Deleted Successfully...'))

});

export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments,
}