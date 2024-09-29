/* eslint-disable no-unused-vars */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { uploadedTime } from '../../Utilities/dateFormat';
import { useSelector } from 'react-redux';
import { user } from '../../Redux/Slice/UserSlice';
import { toggleCommentLike } from '../../API/APICalls';
import CommentBox from './CommentBox';
import PropTypes from 'prop-types';


function UserComment({ comment, setDeleteModal }) {
    const userData = useSelector(user);
    const [commentData, setCommentData] = useState({});
    const [showTooltip, setShowTooltip] = useState(false);
    const [showEditBox, setShowEditBox] = useState(false);
    const tooltipRef = useRef(null);
    const editIconRef = useRef(null);

    useEffect(() => {
        setCommentData(comment);
    }, [comment]);

    const updateCommentList = (updateComment) => {
        if (updateComment) {
            setShowEditBox(false);
            setCommentData((prevComment) => ({
                ...prevComment,
                content: updateComment.content,
                updatedAt: updateComment?.updatedAt || prevComment.updatedAt,
            }));
        }
    };

    const handleLikeClick = async (cmtId) => {
        try {
            const response = await toggleCommentLike(cmtId);
            const isLiked = response?.data?.isLiked;
            if (isLiked !== undefined) {
                setCommentData((prevLike) => ({
                    ...prevLike,
                    likeCount: prevLike.likeCount + (isLiked ? 1 : -1),
                    isLiked: isLiked,
                }));
            } else {
                console.log('Something went wrong while liking the comment');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateClick = () => {
        setShowTooltip((prevState) => !prevState);
    };

    const handleEditClick = (cmtId, cmtContent) => {
        setShowEditBox((prevState) => !prevState);
        setShowTooltip(false);
    };

    const handleClickOutside = (event) => {
        if (
            tooltipRef.current &&
            !tooltipRef.current.contains(event.target) &&
            editIconRef.current &&
            !editIconRef.current.contains(event.target)
        ) {
            setShowTooltip(false);
        }
    };

    useEffect(() => {
        if (showTooltip) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTooltip]);

    const handleDeleteModal = (id) => {
        setDeleteModal({
            visible: true,
            cmtId: id,
        });
        setShowTooltip(false);
    };

    return (
        <>
            {showEditBox ? (
                <CommentBox
                    cmtId={commentData._id}
                    cmtContent={commentData.content}
                    updateCommentList={updateCommentList}
                />
            ) : (
                <div className="flex justify-between">
                    <div className="flex flex-row gap-3 my-4">
                        <img
                            src={commentData?.commentOwnerDetails?.avatar}
                            className="rounded-full w-10 h-10"
                        />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold cursor-pointer">
                                    {commentData?.commentOwnerDetails?.username}
                                </p>
                                <p className="opacity-60 text-sm">
                                    {uploadedTime(commentData?.updatedAt)}
                                </p>
                                {commentData?.commentOwnerDetails?._id ===
                                    userData?._id && (
                                    <>
                                        <div className="relative">
                                            <i
                                                className="fa-regular fa-pen-to-square text-sm opacity-20 cursor-pointer hover:opacity-100"
                                                ref={editIconRef}
                                                onClick={handleUpdateClick}
                                            ></i>
                                            {showTooltip && (
                                                <div
                                                    className="absolute z-[99999] top-0 left-5 bg-zinc-950 rounded-md border border-orange-600 min-w-max cursor-pointer overflow-hidden"
                                                    ref={tooltipRef}
                                                >
                                                    <p
                                                        className="px-3 py-2 text-sm hover:bg-orange-600"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                commentData._id,
                                                                commentData.content
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-regular fa-pen-to-square"></i>{' '}
                                                        &nbsp; Edit
                                                    </p>
                                                    <p
                                                        className="px-3 py-2 text-sm hover:bg-orange-600"
                                                        onClick={() =>
                                                            handleDeleteModal(
                                                                commentData._id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                        &nbsp; Delete
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="w-full">
                                <p className="break-all">{commentData?.content}</p>
                            </div>
                        </div>
                    </div>
                    <div className="m-5 flex flex-col items-center">
                        <i
                            onClick={() => handleLikeClick(commentData?._id)}
                            className={`${
                                commentData.isLiked
                                    ? 'fa-solid text-red-600'
                                    : 'fa-regular'
                            } fa-heart text-lg cursor-pointer`}
                        ></i>
                        <span>
                            {commentData.likeCount !== 0 ? commentData.likeCount : ''}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

UserComment.propTypes={
    comment:PropTypes.object, 
    setDeleteModal:PropTypes.func,
}

export default UserComment;
