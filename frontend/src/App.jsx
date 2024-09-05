import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
function App() {
  return (
    <>
      {/* <p className='text-3xl p-24'>Testing</p> */}
      <Router>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='/login-signup' element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
