import './App.css'
import { Route, Routes } from "react-router-dom"
import Register from "./component/Register";
import Login from "./component/Login";
import Home from "./component/Home";
import Navbar from "./component/Navbar";
import AdminPage from './component/AdminPage';
import Profile from './component/Profile';
import DisableWindow from './component/DisableWindow';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path='/adminPage' element={<AdminPage />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route exact path='/disablewindow' element={<DisableWindow />} />
      </Routes>
    </>
  )
}

export default App
