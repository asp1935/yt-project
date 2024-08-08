import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';      // this packge for aggregation queries

const videoSchema=new Schema(
    {
        videoFile:{
            type:String,   //cloudnary URL  
            required:true
        },
        thumbnail:{
            type:String,   //cloudnary URL  
            required:true
        },
        title:{
            type:String,   //cloudnary URL  
            required:true
        },
        description:{
            type:String,   //cloudnary URL  
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,     
            default:0
        },
        
        isPublished:{
            type:Boolean,
            default:true
        },
        videoOwner:{
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {
        timestamps:true
    }
);
//we cant give all videos at a time as per user scroll or next page load new videos for pagination we use this
videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model('Video',videoSchema )