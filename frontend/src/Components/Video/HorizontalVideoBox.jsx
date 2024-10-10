/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAllVideos } from '../../API/APICalls'
import { uploadedTime } from '../../Utilities/dateFormat';
import { useNavigate } from 'react-router-dom';
function HorizontalVideoBox() {

  const [videoData, setVideoData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [videoDataPage, setVideoDataPage] = useState(0);
  const navigate=useNavigate();

  const fetchAllVideo = async (page) => {
    try {
      const responce = await getAllVideos(page);

      return responce.docs;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    const initialLoadVideo = async () => {
      const data = await fetchAllVideo(videoDataPage);
      if (data) {
        setVideoData(data);
        setHasMore(data.hasNextPage);
      }
    }
    initialLoadVideo();
  }, []);


  const fetchMoreVideos = async () => {
    const nxtPage = videoDataPage + 1;
    const data = await getAllVideos(nxtPage);
    console.log(data);

    if (data) {
      setVideoData(prevVideoData => [...prevVideoData, ...data.data]);
      setVideoDataPage(nxtPage);
      setHasMore(data.hasNextPage);

    }
    else {
      setHasMore(false);
    }
  }



  return (
    <InfiniteScroll
      dataLength={videoData.length}
      next={fetchMoreVideos}
      hasMore={hasMore}
      loader={<h4>Loading more comments...</h4>}
      endMessage={<p style={{ textAlign: 'center' }}>end</p>}
      className='overflow-hidden'
    >
      <div className='mt-10 mx-5 text-white'>
        {
          videoData.map((video) => (
            <div key={video?._id} className='cursor-pointer' >
              <div className='flex h-36 gap-4'>
                <div className='h-28 rounded-xl'onClick={()=>navigate(`/video/${video._id}`)}>
                  <img src={video?.thumbnail} alt="video thumbnail" className='w-52 h-full rounded-lg border' />
                </div>
                <div className='flex flex-col'>
                  <p className='text-xl font-semibold' onClick={()=>navigate(`/video/${video._id}`)}>{video.title}</p>
                  <p className='text-white text-opacity-25 text-sm cursor-pointer' onClick={()=>navigate(`/channel/${video.videoOwnerDetails.username}`)}>{video.videoOwnerDetails.username}</p>
                  <div className='flex gap-2 text-sm'>
                  <p className='text-white text-opacity-25 '>{(video.views===0)?'No Views':video.views}</p>
                  <span className='text-white text-opacity-25'>|</span>
                  <p className='text-white text-opacity-25 '>{uploadedTime(video.updatedAt)}</p>
                  </div>
                    
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </InfiniteScroll>
  )
}

export default HorizontalVideoBox
