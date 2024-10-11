import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login';
import ChannelDashboard from './Components/Channel/Dashboard';
import Dashboard from './Components/Dashboard';
import Navbar from './Components/Navbar';
import Video from './Components/Video/Video';
import { getUserData } from './API/APICalls';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './Redux/Slice/UserSlice';
import { useEffect } from 'react';
import Sidebar from './Components/Home/Sidebar';

function App() {
  const dispatch = useDispatch();
  const isSidebar = useSelector(state => state.sidebarReducer.isSidebar);

  const setCurrentUserData = async () => {
    try {
      const response = await getUserData();
      if (response) {
        dispatch(setUserData(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    setCurrentUserData();
  }, [dispatch]);

  return (
    <>
      <div className='w-[100dvw]  h-[100dvh]'>
        <Router>
          <Navbar />
          <div className="flex flex-col sm:flex-row w-full h-[calc(100vh-4.5rem)]">
            {isSidebar && (
              <div className='bg-black w-full sm:w-1/6 sm:h-full py-5'>
                <Sidebar />
              </div>
            )}
            {/* Main content area where scrolling is enabled */}
            <div className="w-full overflow-y-auto">
              <Routes>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/video/:videoId" element={<Video />} />
                <Route path="/channel/:username" element={<ChannelDashboard />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
