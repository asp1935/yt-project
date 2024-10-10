/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../API/APICalls';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../Redux/Slice/UserSlice';

function AccountOptions({ userData, setIsAccount }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAccountOptionClick = (id) => {
        setIsAccount(false);
        if (id === 'channel') {
            navigate(`/channel/${userData.username}`);
        }
        else {
            navigate('/dashboard');
        }
    }

    const handleLogoutClick = async () => {
        setIsAccount(false);
        try {
            const responce = await logout();
            if (responce) {
                navigate('/');
                dispatch(setUserData(null))
            }
            else {
                console.log(responce);

            }
        } catch (error) {
            console.log("Error while logout", error);

        }
    }
    return (
        <>
            {(userData) && (


                <div className='absolute  bg-black text-white rounded-lg p-5 right-5 z-50 '>
                    <div className='flex gap-3 items-center '>
                        <img src={(userData) ? (userData.avatar) : '<i className="fa-solid fa-user"></i>'} alt="" className='w-10 h-10 rounded-full' />
                        <div>
                            <p className='font-medium'>{userData.fullName}</p>
                            <p>@{userData.username}</p>
                        </div>
                    </div>
                    <hr className='mt-4 border-orange-600' />
                    <div className='mt-4 '>
                        <div className='flex gap-3 items-center px-2 py-3 cursor-pointer rounded-md hover:bg-zinc-800 ' onClick={() => handleAccountOptionClick('channel')}>
                            <i className="fa-regular fa-circle-user text-lg"></i>
                            <p>Your Channel</p>
                        </div>
                        <div className='flex gap-3 items-center px-2 py-3 cursor-pointer rounded-md hover:bg-zinc-800' onClick={() => handleAccountOptionClick('dashboard')}>
                            <i className="fa-solid fa-chalkboard-user text-lg"></i>
                            <p>Channel Dashboard</p>
                        </div>
                    </div>
                    <hr className='mt-4 border-orange-600' />
                    <div className='mt-4 flex'>
                        <button className=' w-full rounded-lg text-lg py-1 outline-none border border-orange-600  hover:bg-zinc-600 hover:bg-opacity-20  focus:bg-opacity-100' onClick={handleLogoutClick}>Signout</button>
                    </div>

                </div>
            )}

        </>
    )
}
AccountOptions.propTypes = {
    userData: PropTypes.object,
    setIsAccount:PropTypes.func,
}
export default AccountOptions
