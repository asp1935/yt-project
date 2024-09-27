/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { uploadedTime } from '../../Utilities/dateFormat'
import { useSelector } from 'react-redux'
import { user } from '../../Redux/Slice/UserSlice'

function UserComment({ comment }) {
    const userData = useSelector(user);
    const [commentLike,setCommentLike]=useState({
        likeCount:0,
        isLiked:false
    });

    useEffect(()=>{
        setCommentLike({
            likeCount:comment?.likeCount,
            isLiked:comment?.isLiked
        })
    },[comment]);

    const handleLikeClick=(cmtId)=>{
        console.log(cmtId);
        
    }


    return (
        <>
            <div className='flex justify-between'>
                <div className='flex flex-row gap-3 my-4 '>
                    <img src={comment?.commentOwnerDetails?.avatar} className='rounded-full w-10 h-10' />
                    <div className=' flex flex-col w-full'>
                        <div className='flex gap-2'>
                            <p className='font-semibold cursor-pointer'>{comment?.commentOwnerDetails?.username}</p>
                            <p className='opacity-60 text-sm'>{uploadedTime(comment?.updatedAt)}</p>
                        </div>
                        <div className='w-full'>
                            <p className='break-all'>{comment?.content}</p>
                        </div>
                        
                    </div>
                </div>
                <div className='m-5 flex flex-col items-center'>
                        <i onClick={()=>handleLikeClick(comment?._id)} className={`${(commentLike.isLiked)?'fa-solid text-red-600':'fa-regular'} fa-heart text-lg cursor-pointer`}></i>
                        <span>{(commentLike.likeCount!==0)?commentLike.likeCount:''}</span>
                </div>
            </div>
        </>
    )
}

export default UserComment
