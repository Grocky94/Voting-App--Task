import axios from 'axios';
import "../App.css"
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const Login = () => {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const redirect = useNavigate();
    const [message, setMessage] = useState('');
    const [validation, setValidation] = useState({ email: '', password: '' })
    const { dispatch } = useContext(AuthContext);


    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value })
        setValidation({ ...validation, [event.target.name]: "" })
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newValidation = { email: '', password: '' };

        if (!userData.email) {
            isValid = false;
            newValidation.email = "Please enter a valid email.";
        }

        if (!userData.password) {
            isValid = false;
            newValidation.password = "Please enter paswword";
        }

        if (!isValid) {
            setValidation(newValidation);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", { userData });
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
                    }
                    else {
                        redirect('/');
                    }
                }, 2000);
            } else {
                setMessage(response.data.message);
                setUserData({ email: "", password: "" })

            }
        } catch (error) {
            setMessage(error.response.data.message);
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
            {message && <div className='customeMessage' style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
            <div className='card'>
                <form onSubmit={handleSubmit}>
                    <div className='inputboxDiv'>
                        <input className='inputTag' placeholder='EMAIL' name="email" type='email' onChange={handleChange} value={userData.email} style={{ borderColor: validation.email ? "red" : "" }} />
                        {validation.email && <div className='validationDiv'>{validation.email}</div>}
                    </div>
                    <div className='inputboxDiv'>
                        <input className='inputTag' placeholder='PASSWORD' type='text' name="password" onChange={handleChange} value={userData.password} style={{ borderColor: validation.password ? "red" : "" }} />
                        {validation.password && <div className='validationDiv'>{validation.password}</div>}

                    </div>
                    <div className='buttonDiv'>
                        <button type='submit'>Login</button>
                        <button onClick={() => redirect('/register')}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
