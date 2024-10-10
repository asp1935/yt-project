/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { uploadedTime } from '../../Utilities/dateFormat';
function VideoBox({ video }) {

    const navigate = useNavigate();


    return (
        <div className='p-2 cursor-pointer ' >
            <div className='relative' onClick={() => navigate(`/video/${video._id}`)}>
                <img src={video.thumbnail} className='w-full h-60 rounded-lg' title={video.title} />
                <div className='absolute bg-black text-white bottom-3 right-2 rounded-md text-sm px-1'>
                    <p>{video.duration.toFixed(2)}</p>
                </div>
            </div>
            <div className='flex  p-2 cursor-pointer'>
                {(video.videoOwnerDetails && (
                    <div>
                        <img src={video.videoOwnerDetails.avatar} className='w-10 h-10 rounded-full' />
                    </div>
                ))}
                <div className='ml-3 text-white'>
                    <h1 onClick={() => navigate(`/video/${video._id}`)}>{video.title}</h1>
                    <div className='text-gray-400 text-sm'>
                    {(video.videoOwnerDetails && (
                        <h2 className='hover:text-white cursor-pointer' onClick={() => navigate(`/channel/${video.videoOwnerDetails.username}`)}>{video.videoOwnerDetails.username}</h2>
                    ))}
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
