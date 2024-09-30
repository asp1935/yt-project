/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import DisplayVideoHome from '../Video/DisplayVideoHome';


function Home() {



  

  return (
    <div className='bg-gray-700 w-full  flex'>
      <div className='bg-black w-1/6 h-[calc(100vh-3.5rem)]'>
        <Sidebar />
      </div>
      <div className='grow'>
        <DisplayVideoHome/> 
      </div>
    </div>
  );
}

export default Home;