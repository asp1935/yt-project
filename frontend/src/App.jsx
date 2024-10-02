import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login';
import Dashboard from './Components/Channel/Dashboard';
import Navbar from './Components/Navbar';
import Video from './Components/Video/Video';
function App() {
  return (
    <>
      {/* <p className='text-3xl p-24'>Testing</p> */}
      <Router>
          <Navbar/>
          
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          {/* <Route path='/dashboard' element={<Dashboard/>}/> */}
          <Route path='/video/:videoId' element={<Video/>}/>
          <Route path='channel/:username' element={<Dashboard/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
