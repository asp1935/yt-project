import React, { useEffect, useRef, useState } from 'react';
import TopSections from './TopSections';
import DisplayVideoHome from '../Video/DisplayVideoHome';
import { useQuery } from '@tanstack/react-query';
import { getChannelVideos, getWatchedHistory } from '../../API/APICalls';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { user } from '../../Redux/Slice/UserSlice';

function Dashboard() {

  const homeRef = useRef(null);
  const videoRef = useRef(null);
  const tweetRef = useRef(null);
  const historyRef = useRef(null);
  const username = useParams();
  const loggedUser = useSelector(user);
  const [currentUser, setCurrentUser] = useState(false);
  const [watchHistory, setWatchHistory] = useState();

  useEffect(() => {
    if (loggedUser && username.username === loggedUser?.username) {
      setCurrentUser(true);
      fetchHistory();
    }
  }, [loggedUser, username, currentUser]);



  const handleScrollTo = (divRef) => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    };
  };

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['channelVideos', username.usename],
    queryFn: () => getChannelVideos(username.username)
  })


  if (isLoading) {
    console.log('Loading...');
  }

  if (!isSuccess) {
    console.log('No data');
  }

  if (isError) {

    console.error('Error fetching data:', error.message);

  }

  const fetchHistory = async () => {
    try {
      const responce = await getWatchedHistory();
      if (responce.data) {
        setWatchHistory((responce.data).reverse());

      }
    } catch (error) {
      console.log(error);

    }
  }



  return (
    <div className='p-5 lg:p-16 bg-[#1e1e1e] ' ref={homeRef}>

      <TopSections />

      <div className='flex text-white gap-14 lg:p-4 justify-center'>
        <p onClick={() => handleScrollTo(homeRef)} className='text-lg cursor-pointer hover:border-b-2'>Home</p>
        <p onClick={() => handleScrollTo(videoRef)} className='text-lg cursor-pointer hover:border-b-2'>Videos</p>
        <p onClick={() => handleScrollTo(tweetRef)} className='text-lg cursor-pointer hover:border-b-2'>Tweets</p>
        {(currentUser) && (<p onClick={() => handleScrollTo(historyRef)} className='text-lg cursor-pointer hover:border-b-2'>History</p>)}

      </div>
      <div className='border border-b-orange-700 w-full mt-2'></div>



      <div ref={videoRef} className='h-dvh w-full'>
        <div className='flex w-auto  overflow-x-scroll'>
          
          <DisplayVideoHome data={data?.data} isError={isError} isLoading={isLoading} isSuccess={isSuccess} error={error} />
          
        </div>

      </div>
      <div ref={tweetRef} className='h-dvh w-full'>
        <h1>tweet</h1>
      </div>
      <div ref={historyRef} className='h-dvh w-full'>

        <DisplayVideoHome data={watchHistory} isSuccess={true} />
      </div>
    </div>
  )
}

export default Dashboard
