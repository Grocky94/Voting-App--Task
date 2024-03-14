import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userData, setUserData] = useState({ name: "", email: "", password: "", role: "", phone: "" });
    const [message, setMessage] = useState('');
    const redirect = useNavigate()
    console.log(userData)
    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userData.name && userData.email && userData.password && userData.phone) {
            try {
                const response = await axios.post('http://localhost:5000/register', { userData })
                if (response?.data?.success) {
                    setMessage(response.data.message);
                    setUserData({ name: "", email: "", password: "", role: "", phone: "" })
                    setTimeout(() => {
                        redirect('/login');
                    }, 2000);
                } else {
                    setMessage(response.data.message)
                    setUserData({ name: "", email: "", password: "", role: "", phone: "" })
                }
            } catch (error) {
                setMessage(error.response.data.message)
                setUserData({ name: "", email: "", password: "", role: "", phone: "" })
                console.log(error)
            }
        } else {
            setMessage("all field are required")
        }

        // Clear message after 2 seconds
        setTimeout(() => {
            setMessage('');
        }, 2000);

    }

    return (
        <div>
            {message && <div style={{ height: "5vh", margin: "auto", border: "1px solid black", width: "30%", marginTop: "5%", marginBottom: "-7%", display: "flex", alignItems: "center", justifyContent: "center", color: message.includes('success')  ? 'Green' : 'Red' }}>{message}</div>}
            <div style={{ width: "25%", margin: "auto", border: "1px solid black", marginTop: "20vh" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ height: "5vh", width: "100%", marginTop: "10%" }}><input placeholder='USERNAME' style={{ height: "4.3vh", width: "60%", marginLeft: "20%" }} name='name' onChange={handleChange} value={userData.name} /></div>
                    <div style={{ height: "5vh", width: "100%", marginTop: "10%" }}><input placeholder='PASSWORD' style={{ height: "4.3vh", width: "60%", marginLeft: "20%" }} name='password' onChange={handleChange} value={userData.password} /></div>
                    <div style={{ height: "5vh", width: "100%", marginTop: "10%" }}><input placeholder='EMAIL ID' style={{ height: "4.3vh", width: "60%", marginLeft: "20%" }} name='email' onChange={handleChange} value={userData.email} /></div>
                    <div style={{ height: "5vh", width: "100%", marginTop: "10%" }}><input placeholder='PHONE NO' style={{ height: "4.3vh", width: "60%", marginLeft: "20%" }} name='phone' onChange={handleChange} value={userData.phone} /></div>
                    {/* <div style={{ height: "5vh", border: "1px solid black", width: "100%", marginTop: "10%" }}><select placeholder='PHONE NO' style={{ height: "100%", width: "60%", marginLeft: "20%" }} name='role' onChange={handleChange} value={userData.role}>
                        <option >Select</option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select></div> */}
                    <div style={{ height: "8vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-evenly", marginTop: "20%", }}>
                        <button onClick={() => redirect('/login')}>Login</button>
                        <button type='submit'>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
