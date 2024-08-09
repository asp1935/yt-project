import mongoose, { isValidObjectId } from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { Subscription } from '../models/subscription.model.js';
import { APIResponce } from '../utils/APIResponce.js';

const toggleSubsription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new APIError(400, 'Invalid Channel Id!!!');
    }

    const alreadySubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: channelId
    });

    if (alreadySubscribed) {
        await Subscription.findByIdAndDelete(alreadySubscribed._id);

        return res.
            status(200)
            .json(new APIResponce(200, { isSubscribed: false }, 'Successfully Unsubscribed Channel!!!'))
    }

    const newSubscriber = await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId
    });

    if (!newSubscriber) {
        throw new APIError(500, 'Something went wrng while subscribing!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, newSubscriber, 'Successfuly Subscribed to Channel...'));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!(isValidObjectId(channelId))) {
        throw new APIError(400, 'Invalid channel ID !!!');
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberInfo',
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
                subscriberInfo: {
                    $first: '$subscriberInfo'
                },
                subCount: {
                    $size: '$subscriberInfo'
                }
            }
        },
        // {
        //     $unwind:"$subscriberInfo"
        // }
    ]);

    if (!subscribers) {
        throw new APIError(500, 'Something went wrong while fetching  subscribers!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, subscribers, 'Successfully Fetched Subscribers....'))
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;

    const channelList = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberInfo',
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
                subscriberInfo: {
                    $first: '$subscriberInfo'
                }
            }
        }
    ]);
    if (!channelList) {
        throw new APIError(500, 'Somethng went wrong while fetching subscribers!!!');
    }

    return res
        .status(200)
        .json(new APIResponce(200, channelList, 'Successfully Fetched Channel...'))

});
export {
    toggleSubsription,
    getSubscribedChannels,
    getUserChannelSubscribers,
}