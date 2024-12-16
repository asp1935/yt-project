/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'

import VideoBox from './VideoBox';
function DisplayVideoHome({data,isLoading,isError,isSuccess,error}) {
    console.log(data);
    
    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error loading data: {error.message}</div>}
            {isSuccess && data && (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-10   '>
                    {
                        data?.map((video) => (
                            <VideoBox key={video._id} video={video} />
                        ))}
                </div>
            )}
        </div>
    )
}

export default DisplayVideoHome;
