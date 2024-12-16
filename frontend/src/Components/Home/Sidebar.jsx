/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setIsSidebar } from '../../Redux/Slice/SidebarSlice';

function Sidebar() {
    const dispatch=useDispatch();
    const handleClick=()=>{
        if(window.innerWidth<=768){
            dispatch(setIsSidebar(false));
        }

    }
    if(window.innerWidth<=768){
        dispatch(setIsSidebar(false))
      }
    return (
        <div className=''>
            <div className='text-white px-5 py-4 text-lg hover:bg-slate-800 '>
                <Link to={'/'} onClick={handleClick}><i className="fa-solid fa-house text-white mx-4"></i> Home</Link>
            </div>
             
            <div className='text-white px-5 py-4 text-lg hover:bg-slate-800'>
                <Link to={'/'} onClick={handleClick}><i className="fa-brands fa-twitter text-white mx-4"></i> Tweets</Link>
            </div>
        </div>
    )
}

export default Sidebar
