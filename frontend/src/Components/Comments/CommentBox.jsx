/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { user } from '../../Redux/Slice/UserSlice';
import { useMutation } from '@tanstack/react-query';
import { add_comment } from '../../API/APICalls';
import { useParams } from 'react-router-dom';
import { setNewUserComment } from '../../Redux/Slice/CommentSlice';
import Comments from './Comments';

function CommentBox() {
  const currentUser = useSelector(user);
  const { videoId } = useParams();
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  const handleComment = (e) => {
    setNewComment(e.target.value);
  };

  const { mutate, isSuccess, isLoading, data } = useMutation({
    mutationKey: ['add_comment'],
    mutationFn: ({ videoId, newComment }) => add_comment(videoId, newComment),

    onError: () => {
      console.log('Something went wrong while commenting');
    },
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setNewUserComment(data.data));
      setNewComment('');  // Clear the input field after successful submission
      console.log('Comment posted successfully:', data.data);
    }
  }, [isSuccess, data, dispatch]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment?.trim()) {
      mutate({ videoId, newComment: newComment.trim() });
    }
  };

  return (
    <>
      <div className="my-5">
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
                className={`${
                  newComment?.trim().length > 0 ? 'block' : 'hidden'
                } self-end py-5`}
              >
                <button
                  type="reset"
                  className="bg-transparent border rounded-full px-4 py-1 mx-2 text-lg font-semibold hover:bg-white hover:bg-opacity-10"
                  onClick={() => setNewComment('')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-transparent border-2 border-orange-600 rounded-full px-4 py-1 mx-5 text-lg font-semibold hover:bg-orange-600 hover:text-black"
                  disabled={isLoading}
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Comments />
    </>
  );
}

export default CommentBox;
