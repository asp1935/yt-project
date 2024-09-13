/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useQuery } from '@tanstack/react-query';
import { getAllVideos } from '../../API/APICalls';
import { useNavigate } from 'react-router-dom';

function Home() {


  const navigate = useNavigate();

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['getAllVideos'],
    queryFn: ()=>getAllVideos(navigate),
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
    console.log('Fetched data:', data);
  }

  if (isError) {
    // if(error.response.status===401){
    //   navigate('/login')
    // }
    console.error('Error fetching data:', error.message);
    
  }

  return (
    <div className='bg-gray-700 w-full flex'>
      <div className='bg-black w-1/6 '>
        <Sidebar />
      </div>
      <div className='grow'>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading data: {error.message}</div>}
        {isSuccess && data && (
          <div>
            <h1>{data.data.docs[1].title
            }</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;