/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { uploadedTime } from '../../Utilities/dateFormat'
import { useSelector } from 'react-redux'
import { user } from '../../Redux/Slice/UserSlice'
import { delete_comment, toggleCommentLike } from '../../API/APICalls';
import CommentBox from './CommentBox';

function UserComment({ comment ,updateCommentList,deleteComment}) {
    const userData = useSelector(user);
    const [commentLike, setCommentLike] = useState({
        likeCount: 0,
        isLiked: false
    });
    const [showTooltip, setShowTooltip] = useState(false);
    const [showEditBox, setShowEditBox] = useState(false);
    

    useEffect(() => {
        setCommentLike({
            likeCount: comment?.likeCount,
            isLiked: comment?.isLiked
        })
    }, [comment]);
    useEffect(()=>{
        if(updateCommentList ){
            setShowEditBox(false);
        }
    },[updateCommentList])

    const handleLikeClick = async (cmtId) => {
        try {
            const responce = await toggleCommentLike(cmtId);
            if (responce?.data?.isLiked === true) {
                setCommentLike(prevLike => ({
                    ...prevLike,
                    likeCount: prevLike.likeCount + 1,
                    isLiked: true
                }))
            }
            else if (responce?.data?.isLiked === false) {
                setCommentLike(prevLike => ({
                    ...prevLike,
                    likeCount: prevLike.likeCount - 1,
                    isLiked: false
                }))
            }
            else {
                console.log('Smething went wrong while liking comment');
            }
        } catch (error) {
            console.log(error);

        }

    }

    const handleUpdateClick = () => {
        setShowTooltip(prevState => !prevState);
    }

    const handleEditClick = (cmtId, cmtContent) => {
        setShowEditBox(prevState => !prevState);
        setShowTooltip(false);
        console.log(cmtId, cmtContent);

    }
    const handleDeleteClick=async(cmtId)=>{
        try {
            const responce=await delete_comment(cmtId);
            if(responce?.success){
                console.log('Comment Deleted Successfully...');
                deleteComment(responce.data._id)
            }
        } catch (error) {
            console.log(error);
            
        }   
    }
    

    return (
        <>
            { (showEditBox)?(
                <CommentBox cmtId={comment._id} cmtContent={comment.content} updateCommentList={updateCommentList}/>
            ):(
            <div className='flex justify-between'>
                <div className='flex flex-row gap-3 my-4 '>
                    <img src={comment?.commentOwnerDetails?.avatar} className='rounded-full w-10 h-10' />
                    <div className=' flex flex-col w-full'>
                        <div className='flex items-center gap-2'>
                            <p className='font-semibold cursor-pointer'>{comment?.commentOwnerDetails?.username}</p>
                            <p className='opacity-60 text-sm'>{uploadedTime(comment?.updatedAt)}</p>
                            {(comment?.commentOwnerDetails?._id === userData?._id) &&
                                <>
                                    <div className='relative '>
                                        <i className="fa-regular fa-pen-to-square text-sm opacity-20 cursor-pointer hover:opacity-100" onClick={handleUpdateClick}></i>
                                        {(showTooltip) &&
                                            <div className='absolute z-[99999] top-0 left-5 bg-zinc-950  rounded-md border border-orange-600 min-w-max cursor-pointer overflow-hidden'>
                                                <p className='px-3 py-2 text-sm hover:bg-orange-600' onClick={() => handleEditClick(comment._id, comment.content)}><i className="fa-regular fa-pen-to-square "></i> &nbsp; Edit</p>
                                                <p className='px-3 py-2 text-sm hover:bg-orange-600' onClick={()=>handleDeleteClick(comment._id)}><i className="fa-regular fa-trash-can"></i>&nbsp; Delete</p>
                                            </div>
                                        }
                                    </div>

                                </>
                            }
                        </div>
                        <div className='w-full'>
                            <p className='break-all'>{comment?.content}</p>
                        </div>

                    </div>
                </div>
                <div className='m-5 flex flex-col items-center'>
                    <i onClick={() => handleLikeClick(comment?._id)} className={`${(commentLike.isLiked) ? 'fa-solid text-red-600' : 'fa-regular'} fa-heart text-lg cursor-pointer `}></i>
                    <span>{(commentLike.likeCount !== 0) ? commentLike.likeCount : ''}</span>
                </div>
            </div>
        )}
        </>
    )
}

export default UserComment
