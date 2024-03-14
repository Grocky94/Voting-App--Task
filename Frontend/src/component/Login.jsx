import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const Login = () => {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const redirect = useNavigate();
    const [message, setMessage] = useState('');
    const { dispatch } = useContext(AuthContext)

    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", { userData })

            if (response?.data?.success) {
                console.log("response?.data?.success:", response?.data?.message)
                setUserData({ email: "", password: "" })
                setMessage(response?.data?.message)
                localStorage.setItem('token', JSON.stringify(response.data.token));
                // localStorage.setItem('user', JSON.stringify(response.data.user));
                dispatch({
                    type: "Login",
                    payload: response.data.user
                })
                setTimeout(() => {
                    if (response?.data?.user?.role === "Admin") {
                        redirect('/adminPage');
                    } else {
                        redirect('/');
                    }
                }, 2000);
            } else {
                setMessage(response.data.message);
                setUserData({ email: "", password: "" })

            }
        } catch (error) {
            setMessage(error);
            setUserData({ email: "", password: "" })
        }

        setTimeout(() => {
            setMessage('');
        }, 2000);

    }
    useEffect(() => {
        const Checker = () => {
            let alreadyIn = JSON.parse(localStorage.getItem("token"))
            if (alreadyIn) {
                redirect('/login');
            }
        }
        Checker()
    }, [redirect])



    return (
        <div>
            {message && <div style={{ height: "5vh", margin: "auto", border: "1px solid black", width: "30%", marginTop: "5%", marginBottom: "-7%", display: "flex", alignItems: "center", justifyContent: "center", color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
            <div style={{ height: "50vh", width: "25%", margin: "auto", border: "1px solid black", marginTop: "20vh" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ height: "5vh", width: "100%", marginTop: "20%" }}><input placeholder='EMAIL' style={{ height: "4.3vh", width: "60%", marginLeft: "20%" }} name="email" onChange={handleChange} value={userData.email} /></div>
                    <div style={{ height: "5vh", width: "100%", marginTop: "15%" }}><input placeholder='PASSWORD' style={{ height: "4.3vh", width: "60%", marginLeft: "20%" }} name="password" onChange={handleChange} value={userData.password} /></div>
                    <div style={{ height: "8vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-evenly", marginTop: "20%", }}>
                        <button type='submit'>Login</button>
                        <button onClick={() => redirect('/register')}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
