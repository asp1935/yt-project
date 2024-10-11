/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getchannelProfile, toggleSubscribe } from '../../API/APICalls';

function TopSections() {

    const username = useParams();
    const [userData, setUserData] = useState([]);

    const { isLoading, isError, isSuccess, data, error } = useQuery({
        queryKey: ['userChannelProfile', username],
        queryFn: () => getchannelProfile(username),
    })


    useEffect(() => {
        if (isSuccess && data) {
            setUserData(data.data);
        }
    }, [data, isSuccess])

    const handleSubcribeClick = async (channelId) => {
        try {
            const responce = await toggleSubscribe(channelId);
            if (responce.data.isSubscribed === undefined) {
                setUserData(prevData => ({
                    ...prevData,
                    subscriberCount: prevData.subscriberCount + 1,
                    isSubscribed: true
                }))
            }
            else if (responce.data.isSubscribed === false) {
                setUserData(prevData => ({
                    ...prevData,
                    subscriberCount: prevData.subscriberCount - 1,
                    isSubscribed: false
                }))
            }
            else {
                console.log('Something went Wrong');
            }
        } catch (error) {
            console.log(error);

        }

    }


    if (isLoading) {
        return <div><h1>Loading....</h1></div>;
    }
    if (isError) {
        return <div><h1>Something went wrong please refresh page</h1></div>
    }


    return (
        <div className=' text-white'>
            <div className=' h-36 sm:h-52 lg:h-72 w-full'>
                <img src={userData?.coverImage} alt='cover Image' className='rounded-2xl w-full h-full' loading='lazy' />
            </div>
            <div className='flex justify-between items-center'>
                <div className='flex my-10 gap-3 lg:gap-5'>
                    <div className='w-20 lg:w-52 h-20 lg:h-52'>
                        <img src={userData?.avatar} alt='avatarv image' className='rounded-full w-full h-full object-cover' loading='lazy' />
                    </div>
                    <div className='flex flex-col justify-center '>
                        <h2 className='text-lg lg:text-5xl font-bold z-50' >{userData?.fullName}</h2>
                        <p className='my-3 font-semibold text-white text-opacity-25 text-xs'><span>{userData?.username} | </span>
                            <span>{userData?.subscriberCount}  Subscriber{userData?.subscriberCount !== 1 ? 's' : ''}</span></p>

                        <button onClick={() => handleSubcribeClick(userData._id)} className={`outline-none cursor-pointer rounded-full px-5 py-1 text-sm lg:text-xl font-semibold border-2 border-orange-600 ${userData?.isSubscribed ? 'bg-neutral-800' : ''}`}>{userData?.isSubscribed ? 'Subscribed' : 'Subscribe'}</button>
                    </div>
                </div>
                <div>
                    <p className='border text-xs lg:mr-5 rounded-lg p-1 lg:px-5 lg:py-2 cursor-pointer hover:border-orange-700 hover:bg-white hover:bg-opacity-10 ' 
                        onClick={()=>window.open(`mailto:${userData.email}`,'_blank')}>Contact <i className="fa-regular fa-paper-plane"></i></p>
                </div>
            </div>
        </div>
    )
}

export default TopSections
