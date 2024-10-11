/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import TopSections from './TopSections';
import DisplayVideoHome from '../Video/DisplayVideoHome';
import { useQuery } from '@tanstack/react-query';
import { getChannelVideos } from '../../API/APICalls';
import { useParams } from 'react-router-dom';

function Dashboard() {

  const homeRef = useRef(null);
  const videoRef = useRef(null);
  const tweetRef = useRef(null);
  const username = useParams();
  
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

  return (
    <div className='p-5 lg:p-16 bg-[#1e1e1e] ' ref={homeRef}>

      <TopSections />

      <div className='flex text-white gap-14 lg:p-4 justify-center'>
        <p onClick={() => handleScrollTo(homeRef)} className='text-lg cursor-pointer hover:border-b-2'>Home</p>
        <p onClick={() => handleScrollTo(videoRef)} className='text-lg cursor-pointer hover:border-b-2'>Videos</p>
        <p onClick={() => handleScrollTo(tweetRef)} className='text-lg cursor-pointer hover:border-b-2'>Tweets</p>
      </div>
      <div className='border border-b-orange-700 w-full mt-2'></div>



      <div ref={videoRef} className='h-dvh w-full'>
        <DisplayVideoHome data={data?.data} isError={isError} isLoading={isLoading} isSuccess={isSuccess} error={error}/>
      </div>
      <div ref={tweetRef} className='h-dvh w-full'>
        <h1>tweet</h1>
      </div>
    </div>
  )
}

export default Dashboard
