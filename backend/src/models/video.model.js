import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';      // this packge for aggregation queries

const videoSchema=new Schema(
    {
        videoFile:{
            type:String,   //cloudnary URL  
            required:true
        },
        thumnail:{
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
        videoFile:{
            type:String,   //cloudnary URL  
            required:true
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
//
videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model('Video',videoSchema )