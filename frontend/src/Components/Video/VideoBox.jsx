/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
function VideoBox({ video }) {

    const navigate=useNavigate();
    const uploadedTime = (date) => {
        const now = new Date();
        const updatedTime = new Date(date);

        const diffInSec = Math.floor((now - updatedTime) / 1000);
        const diffInMin = Math.floor(diffInSec / 60);
        const diffInHour = Math.floor(diffInMin / 60);
        const diffInDays = Math.floor(diffInHour / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);

        if (diffInYears > 0) {
            return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        }
        else if (diffInMonths > 0) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        } else if (diffInWeeks > 0) {
            return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
        }
        else if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
        else if (diffInHour > 0) {
            return `${diffInHour} hour${diffInHour > 1 ? 's' : ''} ago`;
        }
        else if (diffInMin > 0) {
            return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
        }
        else {
            return `${diffInSec} second${diffInSec>1?'s':''} ago`;
        }
    };

    return (
        <div className='p-2 cursor-pointer ' onClick={()=>navigate(`/video/${video._id}`)}>
            <div className='relative'>
                <img src={video.thumbnail} className='w-full h-60 rounded-lg' title={video.title} />
                <div className='absolute bg-black text-white bottom-3 right-2 rounded-md text-sm px-1'>
                    <p>{video.duration.toFixed(2)}</p>
                </div>
            </div>
            <div className='flex  p-2 cursor-pointer'>
                <div>
                    <img src={video.videoOwnerDetails.avatar} className='w-10 h-10 rounded-full' />
                </div>
                <div className='ml-3 text-white'>
                    <h1>{video.title}</h1>
                    <div className='text-gray-400 text-sm'>
                        <h2 className='hover:text-white cursor-pointer'>{video.videoOwnerDetails.username}</h2>
                        <span>{(video.views === 0) ? 'No Views' : `${video.views} Views`}</span> 
                        <span className='mx-2'>|</span>
                        <span>{uploadedTime(video.updatedAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

VideoBox.propTypes = {
    video: PropTypes.object.isRequired,
    title: PropTypes.string
}
export default VideoBox
