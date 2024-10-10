/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { user } from '../Redux/Slice/UserSlice'
import AccountOptions from './Popups/AccountOptions';
import { setIsSidebar } from '../Redux/Slice/SidebarSlice';

function Navbar() {
  const userData = useSelector(user);
  const [isAccount, setIsAccount] = useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleMenuClick=()=>{
    dispatch(setIsSidebar());
  }

  return (
    <>
      <div className='bg-black text-white flex justify-between items-center px-5'>
        <div className=' '>
          <div className='flex gap-4 items-center'>
            <i className="fa-solid fa-bars p-4 rounded-full hover:bg-slate-800" onClick={handleMenuClick}></i>
            <p className='p-4'>Logo</p>
          </div>
        </div>
        <div className='p-4 '>
          <input
            className='w-80 outline-none bg-transparent border rounded-s-full py-1 px-4 border-zinc-500 focus:border-orange-600'
            placeholder='Search' />
          <button className='outline-none border-y border-e rounded-e-full py-1 px-4 border-zinc-500 hover:text-orange-600' ><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div className='p-4 cursor-pointer'>
          {
            (userData) ? (
              <img src={(userData) ? (userData.avatar) : '<i className="fa-solid fa-user"></i>'} alt="" onClick={() => setIsAccount(prevState => !prevState)} className='w-10 h-10 rounded-full' />
            ) : (
              <button className='px-4 py-1 rounded-lg text-lg outline-none border hover:border-orange-600 hover:bg-zinc-800 hover:bg-opacity-80 focus:bg-opacity-100' onClick={()=>navigate('/login')} >Login</button>
            )
          }
        </div>
      </div>
      {isAccount &&

        (
          <AccountOptions userData={userData} setIsAccount={setIsAccount}/>
        )}

    </>
  )
}

export default Navbar
