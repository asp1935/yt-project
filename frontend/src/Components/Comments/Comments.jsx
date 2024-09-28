/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearComments, setCommentCnt } from '../../Redux/Slice/CommentSlice';
import UserComments from './UserComment';
import { getVideoComments as fetchVideoComment } from '../../API/APICalls';
import { user } from '../../Redux/Slice/UserSlice';

function Comments() {
  
  const { videoId } = useParams();
  const [commentData, setCommentData] = useState();
  const [videoComments, setVideoComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages] = useState(1);
  
  const userData=useSelector(user);
  const newUserComment=useSelector(state=>state.commentReducer.newUserComment);
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
  useEffect(()=>{
    if(newUserComment){
      const newComment = {
        _id: newUserComment._id,
        content: newUserComment.content,
        updatedAt: newUserComment.updatedAt,
        commentOwnerDetails: {
          _id:userData._id,
          avatar: userData?.avatar,
          fullName: userData?.fullName,
          username: userData?.username
        },
        isLiked: false,
        likeCount: 0
      };

      setVideoComments(prevComments=>[newComment,...prevComments])
      dispatch(clearComments());
    }
    
  },[dispatch, newUserComment, userData?.avatar, userData?.fullName, userData?.username])

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
  const updateCommentList=(updateComment)=>{
    setVideoComments(prevComments=>
      prevComments.map(comment=>
        comment._id===updateComment._id?{...comment,content:updateComment.content,...(updateComment.updatedAt)&&{ updatedAt:updateComment?.updatedAt}}:comment
      )
    );
  };
  const deleteComment=(commentId)=>{
    setVideoComments(prevComments=>
      prevComments.filter((comment)=>comment._id!== commentId)
    );
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={videoComments.length}
        next={fetchMoreComments}
        hasMore={hasMore}
        loader={<h4>Loading more comments...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}><b>No more comments to display</b></p>} 
        className='overflow-hidden'
      >

        {videoComments.map((comment) => (
          <UserComments comment={comment} key={comment._id} updateCommentList={updateCommentList} deleteComment={deleteComment}/>
        ))}

      </InfiniteScroll>

    </div>
  );
}

export default Comments;
