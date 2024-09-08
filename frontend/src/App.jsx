import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Components/Dashboard';
import Navbar from './Components/Navbar';
function App() {
  return (
    <>
      {/* <p className='text-3xl p-24'>Testing</p> */}
      <Router>
          <Navbar/>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
            />
        </Routes>
      </Router>
    </>
  )
}

export default App
