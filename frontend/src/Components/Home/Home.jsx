/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos } from '../../API/APICalls';
import { useNavigate } from 'react-router-dom';
import VideoBox from '../Video/VideoBox';

function Home() {


  const navigate = useNavigate();

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['getAllVideos'],
    queryFn: () => getAllVideos(navigate),
    placeholderData: [],
    keepPreviousData: true,

  });
  // useEffect(() => {
  //   // If there is an error and the status code is 401, redirect to login
  //   if (isError && error.response && error.response.status === 401) {
  //     navigate('/login');
  //   }
  // }, [isError, error, navigate]);

  if (isLoading) {
    console.log('Loading...');
  }

  if (isSuccess) {
    console.log('Fetched data:', data.docs);
  }

  if (isError) {
    // if(error.response.status===401){
    //   navigate('/login')
    // }
    console.error('Error fetching data:', error.message);

  }

  return (
    <div className='bg-gray-700 w-full  flex'>
      <div className='bg-black w-1/6 h-[calc(100vh-3.5rem)]'>
        <Sidebar />
      </div>
      <div className='grow'>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading data: {error.message}</div>}
        {isSuccess && data && (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-2 '>
            {
              data?.docs?.map((video) => (
                <VideoBox key={video._id} video={video} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;