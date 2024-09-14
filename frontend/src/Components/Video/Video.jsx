/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getVideoById } from '../../API/APICalls';

function Video() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [videoData, setVideoData] = useState(null);

    const { data, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ['getVideoById', videoId],
        queryFn: () => getVideoById(videoId),
        retry: (failureCount, err) => {
            // Retry logic: retry unless 401 error
            if (err.response && err.response.status === 401) {
                return false; // Do not retry if it's a 401 error
            }
            return failureCount < 3; // Retry up to 3 times for other errors
        },
    });

    useEffect(() => {
        if (isError && error.response && error.response.status === 401) {
            navigate('/login');  // Redirect to login on 401 Unauthorized
        }
    }, [isError, error, navigate]);

    useEffect(() => {
        if (isSuccess) {
            setVideoData(data.data[0]);
        }
    }, [isSuccess, data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        // Optionally handle and display errors
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
           
            {videoData ? (
                <div className='p-5'>
                    <iframe src={videoData.videoFile} className='w-full'/>
                    <h1>{videoData.title}</h1>
                   
                </div>
            ) : (
                <div>No video data available</div>
            )}
        </div>
    );
}

export default Video;
