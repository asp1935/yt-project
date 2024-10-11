/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearComments, setCommentCnt } from '../../Redux/Slice/CommentSlice';
import UserComments from './UserComment';
import { delete_comment, getVideoComments as fetchVideoComment } from '../../API/APICalls';
import { user } from '../../Redux/Slice/UserSlice';
import { setIsSidebar } from '../../Redux/Slice/SidebarSlice';

function Comments() {

  const { videoId } = useParams();
  const [commentData, setCommentData] = useState();
  const [videoComments, setVideoComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages] = useState(1);

  const userData = useSelector(user);
  const newUserComment = useSelector(state => state.commentReducer.newUserComment);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    cmtId: null
  });

  const dispatch = useDispatch();

  const getVideoComments = async (videoId, page) => {
    try {
      const response = await fetchVideoComment(videoId, page);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  useEffect(() => {
    if (newUserComment) {
      const newComment = {
        _id: newUserComment._id,
        content: newUserComment.content,
        updatedAt: newUserComment.updatedAt,
        commentOwnerDetails: {
          _id: userData._id,
          avatar: userData?.avatar,
          fullName: userData?.fullName,
          username: userData?.username
        },
        isLiked: false,
        likeCount: 0
      };

      setVideoComments(prevComments => [newComment, ...prevComments])
      dispatch(clearComments());
    }

  }, [dispatch, newUserComment, userData._id, userData?.avatar, userData?.fullName, userData?.username])

  useEffect(() => {
    const initialLoadComments = async () => {
      const data = await getVideoComments(videoId, 0);
      if (data) {
        setCommentData(data)
        setVideoComments(data.docs);
        setHasMore(data.hasNextPage);
        dispatch(setCommentCnt(data.totalDocs));
        
      }
    };
    initialLoadComments();
  }, [videoId, dispatch]);

  const fetchMoreComments = async () => {
    const nextPage = pages + 1;
    const data = await getVideoComments(videoId, nextPage);
    if (data) {
      setVideoComments((prevComments) => [...prevComments, ...data.docs]);
      setPages(nextPage);
      setHasMore(data.hasNextPage);
    }
    else {
      setHasMore(false)
    }
  };

  // const updateCommentList = (updateComment) => {
  //   setVideoComments(prevComments =>
  //     prevComments.map(comment =>
  //       comment._id === updateComment._id ? { ...comment, content: updateComment.content, ...(updateComment.updatedAt) && { updatedAt: updateComment?.updatedAt } } : comment
  //     )
  //   );
  // };

  const deleteComment = (commentId) => {
    setVideoComments(prevComments =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  const handleDeleteCancleClick = () => {
    setDeleteModal({
      visible: false,
      cmtId: null,
    });
  };

  const handleDeleteClick = async () => {
    try {
      const responce = await delete_comment(deleteModal.cmtId);
      if (responce?.success) {
        console.log('Comment Deleted Successfully...');
        setDeleteModal({
          visible: false,
          cmtId: null,
        });
        deleteComment(responce.data._id)

      }
    } catch (error) {
      console.log(error);
      setDeleteModal({
        visible: false,
        cmtId: null
      });
    }
  }


  return (
    <>
      <div className='relative h-80 lg:h-auto overflow-auto'>
        <InfiniteScroll
          dataLength={videoComments.length}
          next={fetchMoreComments}
          hasMore={hasMore}
          loader={<h4>Loading more comments...</h4>}
          endMessage={<p style={{ textAlign: 'center' }}><b>No more comments to display</b></p>}
          className='overflow-hidden'
        >

          {videoComments.map((comment) => (
            <UserComments comment={comment} key={comment._id}  deleteComment={deleteComment} setDeleteModal={setDeleteModal} />
          ))}

        </InfiniteScroll>

        {(deleteModal.visible) &&
          <div className='absolute z-50  top-0 w-full h-full bg-white/3 backdrop-blur-[5px] border-0 border-white/3 shadow-md rounded-xl flex justify-center align-middle items-center'>
            <div className=' w-60 max-w-96 h-fit border border-orange-600 rounded-xl shadow-custom bg-zinc-900 p-5'>
              <h4 className='text-lg font-bold border-b'>Delete Comment</h4>
              <p className='py-4'>Delete your comment permanently?</p>
              <div className='flex justify-end gap-1 mt-2'>
                <button className='rounded-full px-2 py-1 outline-none bg-transparent border-orange-600 hover:bg-orange-600 hover:border hover:bg-opacity-25' onClick={(handleDeleteCancleClick)}>Cancle</button>
                <button className='rounded-full px-2 py-1 outline-none bg-transparent border-orange-600 hover:bg-orange-600 hover:border hover:bg-opacity-25' onClick={handleDeleteClick}>Delete</button>
              </div>
            </div>
          </div>
        }
      </div>

    </>
  );
}

export default Comments;
