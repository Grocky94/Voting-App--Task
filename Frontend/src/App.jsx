import './App.css'
import { Route, Routes } from "react-router-dom"
import Register from "./component/Register";
import Login from "./component/Login";
import Home from "./component/Home";
import Navbar from "./component/Navbar";
import AdminPage from './component/AdminPage';
import Profile from './component/Profile';

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
      </Routes>
    </>
  )
}

export default App
