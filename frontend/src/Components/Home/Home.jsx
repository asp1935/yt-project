/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import DisplayVideoHome from '../Video/DisplayVideoHome';
import { getAllVideos } from '../../API/APICalls';
import { useQuery } from '@tanstack/react-query';


function Home() {



  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['getAllVideos'],
    queryFn: () => getAllVideos(),
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

  if (!isSuccess) {
    console.log('No data');
  }

  if (isError) {
    // if(error.response.status===401){
    //   navigate('/login')
    // }
    console.error('Error fetching data:', error.message);

  }


console.log(data);


  return (
    <div className='bg-gray-700 w-full min-h-full flex'>
      <div className='grow'>
        <DisplayVideoHome data={data.docs} isError={isError} isLoading={isLoading} isSuccess={isSuccess} error={error} />
      </div>
    </div>
  );
}

export default Home;