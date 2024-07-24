import './App.css'
import HomePage from './pages/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Analytics from './pages/Analytics'
import GreenWave from './pages/GreenWave'
import AdminPanel from './pages/AdminPanelPage'


function App() {

  return (
  <>
      { <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/Home" element={<HomePage/>}></Route>
          {/* <Route path="/Analytics" element={<Analytics/>}></Route> */}
          <Route path="/GreenWave" element={<GreenWave/>}></Route>
          {/* <Route path="/Admin" element={<AdminPanel/>}></Route> */}
        </Routes>
      </BrowserRouter> }
    </>
  )
}

export default App
