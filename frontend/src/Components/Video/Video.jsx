/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getVideoById, toggleSubscribe, toggleVideoLike } from '../../API/APICalls';
import ReadMore from '../ReadMore';
import CommentBox from '../Comments/CommentBox';
import useAuthUser from '../../Utilities/useAuthUser';
import { useSelector } from 'react-redux';
import Comments from '../Comments/Comments';

function Video() {
    useAuthUser();
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [videoData, setVideoData] = useState(null);
    const videoRef = useRef(null);
    const commentCnt=useSelector(state=>state.commentReducer.totalComments);

    const [isSubscribed, setIsSubscribed] = useState({
        subscribed: false,
        count: 0,
    });
    const [isLiked, setIsLiked] = useState({
        liked: false,
        count: 0
    });

    // const [commentCnt,setCommentCnt]=useState(0);



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
        if (isSuccess && data) {
            const video = data.data[0];
            setVideoData(video);
            setIsSubscribed({
                subscribed: (video.videoOwner.isSubscribed === false) ? false : true,
                count: video.videoOwner.subscriberCount
            })
            setIsLiked(
                {
                    liked: video?.isLiked,
                    count: video?.likeCount
                });
        }
    }, [isSuccess, data]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        // Optionally handle and display errors
        return <div>Error: {error.message}</div>;
    }


    const handleSubscribeClick = async (channelId) => {
        try {
            const responce = await toggleSubscribe(channelId);

            if (responce?.data?.isSubscribed === undefined) {
                setIsSubscribed(prevState => ({
                    ...prevState,
                    subscribed: true,
                    count: prevState.count + 1,
                }));
            }
            else if (responce?.data?.isSubscribed === false) {
                setIsSubscribed(prevState => ({
                    ...prevState,
                    subscribed: false,
                    count: prevState.count - 1,
                }));
            }
            else {
                console.log('Something went Wrong while Subscribing');
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleLikeClick = async (videoId) => {
        try {
            const responce = await toggleVideoLike(videoId);
            if (responce?.data?.isLiked === undefined) {
                setIsLiked(prevState => ({
                    ...prevState,
                    liked: true,
                    count: prevState.count + 1
                }));
            }
            else if (responce?.data?.isLiked === false) {
                setIsLiked(prevState => ({
                    ...prevState,
                    liked: false,
                    count: prevState.count - 1
                }));
            }
            else {
                console.log('Something went Wrong while Liking Video');
            }
        } catch (error) {
            console.log(error);

        }
    }

    const getFormatedDate = (isoDate) => {
        const date = new Date(isoDate);
        const formatedDate = `${String(date.getDay()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear())}`;
        return formatedDate;
    }

    return (
        <div className=' max-h-full bg-[#1e1e1e] flex justify-center'>
            <div className='container flex flex-col sm:flex-row '>
                <div className='w-[100%] sm:w-[70%]'>
                    {videoData ? (
                        <div className='mt-10'>
                            <video ref={videoRef} src={videoData.videoFile} type='video/mp4' className='w-full h-[30rem] rounded-xl' controls />
                            {/* <button onClick={togglePlay}>Play</button> */}
                            <div className='text-white mt-5 '>
                                <h1 className='text-2xl font-bold'>{videoData.title}</h1>
                                <div className='mt-5 flex justify-between items-center'>
                                    <div className='flex gap-5'>
                                        <img src={videoData?.videoOwner?.avatar} className='rounded-full w-14 h-14 ' alt='avatar img' />
                                        <div className=''>
                                            <p className='font-semibold text-lg'>{videoData?.videoOwner?.username}</p>
                                            <p className='text-sm text-gray-400'>{isSubscribed.count} Subscribers</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-5 items-center'>
                                        <div>
                                            <button onClick={() => handleLikeClick(videoData?._id)} className='outline-none border border-orange-600 px-5 rounded-full  hover:bg-orange-600 hover:bg-opacity-50'><i className={`fa-${isLiked.liked ? 'solid' : 'regular'} fa-thumbs-up text-2xl`}></i><span className='text-2xl ml-2'>{isLiked.count}</span></button>

                                        </div>
                                        <button onClick={() => handleSubscribeClick(videoData.videoOwner._id)} className={`rounded-full border border-orange-600  py-1 text-xl font-normal ${(isSubscribed.subscribed) ? 'bg-white bg-opacity-10 px-2' : 'px-4'} `}>{(isSubscribed.subscribed) ? ('Subscribed') : ('Subscribe')}</button>
                                    </div>
                                </div>
                                <div className='bg-white bg-opacity-5 rounded-xl text-wrap p-5 my-5 '>
                                    <ReadMore>
                                        <p className='font-semibold my-2'><span className='mr-2'>{videoData?.views === 0 ? 'No Views' : videoData?.views}</span> <span>{getFormatedDate(videoData?.updatedAt)}</span></p>
                                        <p className='mb-2'>{videoData?.description}</p>
                                        <div className='flex gap-5 my-5'>
                                            <img src={videoData?.videoOwner?.avatar} className='rounded-full w-14 h-14 ' alt='avatar img' />
                                            <div className=''>
                                                <p className='font-semibold text-lg'>{videoData?.videoOwner?.username}</p>
                                                <p className='text-sm text-gray-400'>{videoData?.videoOwner?.subscriberCount} Subscribers</p>
                                            </div>
                                        </div>
                                    </ReadMore>
                                </div>
                                <div>
                                    <p className='text-xl font-semibold'>{(commentCnt>0)?`${commentCnt} Comment${(commentCnt===1)?'':'s'}`:'No Comments'}</p>
                                    <CommentBox/>
                                    <Comments />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>No video data available</div>
                    )}
                </div>
                <div className='w-full sm:w-[30%]'>
                    <p>aasdasdsadsd</p>
                </div>
            </div>
        </div>
    );
}

export default Video;
