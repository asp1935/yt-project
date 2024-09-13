/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <div className=''>
            <div className='text-white px-5 py-4 text-lg hover:bg-slate-800 '>
                <Link to={'/'}><i className="fa-solid fa-house text-white mx-4"></i> Home</Link>
            </div>
            
            <div className='text-white px-5 py-4 text-lg hover:bg-slate-800'>
                <Link to={'/'}><i className="fa-brands fa-twitter text-white mx-4"></i> Tweets</Link>
            </div>
        </div>
    )
}

export default Sidebar
