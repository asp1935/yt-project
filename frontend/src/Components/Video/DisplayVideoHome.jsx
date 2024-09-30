// eslint-disable-next-line no-unused-vars
import React from 'react'
import { getAllVideos } from '../../API/APICalls';
import { useQuery } from '@tanstack/react-query';
import VideoBox from './VideoBox';
function DisplayVideoHome() {
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
        <div>
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
    )
}

export default DisplayVideoHome;
