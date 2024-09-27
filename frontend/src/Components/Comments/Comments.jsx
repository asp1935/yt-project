import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCommentCnt } from '../../Redux/Slice/CommentSlice';
import UserComments from './UserComment';
import { getVideoComments as fetchVideoComment } from '../../API/APICalls';

function Comments() {
  const { videoId } = useParams();
  const [commentData, setCommentData] = useState();
  const [videoComments, setVideoComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages] = useState(1);

  const dispatch = useDispatch();

  const getVideoComments = async (videoId, page) => {
    try {
      const response = await fetchVideoComment(videoId, page);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

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
          <UserComments comment={comment} key={comment._id} />
        ))}

      </InfiniteScroll>

    </div>
  );
}

export default Comments;
