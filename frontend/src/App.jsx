import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login';
import ChannelDashboard from './Components/Channel/Dashboard';
import Dashboard from './Components/Dashboard';
import Navbar from './Components/Navbar';
import Video from './Components/Video/Video';
import { getUserData } from './API/APICalls';
import { useDispatch } from 'react-redux';
import { setUserData } from './Redux/Slice/UserSlice';
import { useEffect } from 'react';
import Sidebar from './Components/Home/Sidebar';
function App() {
  const dispatch=useDispatch();

  const setCurrentUserData=async()=>{
    const responce=await getUserData();
    if(responce){
      dispatch(setUserData(responce.data));    
    }
  }

  useEffect(()=>{
    setCurrentUserData();
  },[])
  return (
    <>
      {/* <p className='text-3xl p-24'>Testing</p> */}
      <Router>
          <Navbar/>
          {/* <Sidebar/> */}
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/video/:videoId' element={<Video/>}/>
          <Route path='channel/:username' element={<ChannelDashboard/>}/>

        </Routes>
      </Router>
    </>
  )
}

export default App
