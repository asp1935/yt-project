/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from '../../Redux/Slice/UserSlice';
import { useMutation } from '@tanstack/react-query';
import { add_comment, update_comment } from '../../API/APICalls';
import { useParams } from 'react-router-dom';
import { setNewUserComment } from '../../Redux/Slice/CommentSlice';
import PropTypes from 'prop-types';

function CommentBox({ cmtId, cmtContent ,updateCommentList}) {
  const currentUser = useSelector(user);
  const { videoId } = useParams();
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const [commentId, setCommentId] = useState();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (cmtId && cmtContent) {
      setNewComment(cmtContent);
      setCommentId(cmtId);
      setUpdate(true);
    }
  }, [cmtContent, cmtId]);

  const handleComment = (e) => {
    setNewComment(e.target.value);
  }

  const updateCommentMutation = useMutation({
    mutationKey: ['update_comment'],
    mutationFn: ({ cmtId, updatedComment }) => update_comment(cmtId, updatedComment),
    onSuccess:(data)=>{
      setNewComment('');
      updateCommentList(data.data);
    },
    onError: () => {
      console.log('Something went wrong while updating...');

    }
  })

  const addNewCommentMutation = useMutation({
    mutationKey: ['add_comment'],
    mutationFn: ({ videoId, newComment }) => add_comment(videoId, newComment),
    onSuccess:(data)=>{
      dispatch(setNewUserComment(data.data));
      setNewComment('');
    },
    onError: () => {
      console.log('Something went wrong while commenting');
    },
  });

  // useEffect(() => {
  //   const { isSuccess, data } = update ? updateCommentMutation : addNewCommentMutation;    
  //   if (isSuccess && data.data) {
  //     dispatch(setNewUserComment(data.data));
  //     setNewComment('');  // Clear the input field after successful submission
  //     console.log('Comment posted successfully:', data.data); 
  //     if(update){ 
        
  //       updateCommentList(data.data)
  //     }
  //   }
  // }, [dispatch, update, updateCommentMutation.isSuccess, addNewCommentMutation.isSuccess, updateCommentMutation.data, addNewCommentMutation.data, updateCommentMutation, addNewCommentMutation, updateCommentList]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment?.trim()) {
      if (update) {
        
        
        updateCommentMutation.mutate({ cmtId: commentId, updatedComment: newComment.trim() });

      }
      else {
        addNewCommentMutation.mutate({ videoId, newComment: newComment.trim() })
      }
    }
  };
  const handleCancel = () => {
    setNewComment('');  // Clear the comment input field
    setUpdate(false);   // Reset the update state, indicating no longer in "edit" mode
    setCommentId(null); // Clear the commentId being edited (optional)
    updateCommentList({_id:cmtId,content:cmtContent});
  };

  return (
    <>
      <div className="my-5 ">
        <div className="flex gap-5">
          <img
            src={currentUser?.avatar}
            alt="avatar"
            className="rounded-full w-10 h-10"
          />
          <div className="grow">
            <form className="flex flex-col" onSubmit={handleCommentSubmit}>
              <input
                className="outline-none bg-transparent border-b w-full focus:border-b-2"
                type="text"
                name="comment"
                value={newComment}
                onChange={handleComment}
                placeholder="Add a Comment..."
              />
              <div
                className={`${newComment?.trim().length > 0 ? 'block' : 'hidden'
                  } self-end py-5`}
              >
                <button
                  type="reset"
                  className="bg-transparent border rounded-full px-4 py-1 mx-2 text-lg font-semibold hover:bg-white hover:bg-opacity-10"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-transparent border-2 border-orange-600 rounded-full px-4 py-1 mx-5 text-lg font-semibold hover:bg-orange-600 hover:text-black"
                  disabled={addNewCommentMutation.isLoading || updateCommentMutation.isLoading}
                >
                  {addNewCommentMutation.isLoading || updateCommentMutation.isLoading ? 'Posting...' : update ? 'Update' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}

CommentBox.propTypes={
  cmtId:PropTypes.string, 
  cmtContent:PropTypes.string ,
  updateCommentList:PropTypes.func,
}

export default CommentBox;
