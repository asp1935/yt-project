/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='bg-black text-white flex justify-center'>
      <div className='p-4 hover:bg-slate-800'>
        <Link to={'/'}>Home</Link>
      </div>
      <div className='p-4 hover:bg-slate-800'>
        <Link to={'/dashboard'}>Dashborad</Link>
      </div>
      <div className='p-4 hover:bg-slate-800'>
        <Link to={'/login'}>Login</Link>
      </div>
    </div>
  )
}

export default Navbar
