import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        commentOwner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps:true
    }
);

//give call from where to where video/comments to give like pagination use only
commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model('Comment', commentSchema);