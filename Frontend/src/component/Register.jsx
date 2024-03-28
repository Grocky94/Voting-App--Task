import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../App.css"

const Register = () => {
    const [userData, setUserData] = useState({ name: "", email: "", password: "", role: "", phone: "" });
    const [message, setMessage] = useState('');
    const [validation, setValidation] = useState({ name: "", email: "", password: "", phone: "" })

    const redirect = useNavigate()
    console.log(userData)
    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value })
        setValidation({ ...validation, [event.target.name]: "" })

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newValidation = { name: "", email: "", password: "", phone: "" };

        if (!userData.name) {
            isValid = false;
            newValidation.name = "Please enter a name.";
        }
        if (!userData.email) {
            isValid = false;
            newValidation.email = "Please enter valid email";
        }
        if (!userData.phone) {
            isValid = false;
            newValidation.phone = "Please enter your Phone";
        }
        if (!userData.password) {
            isValid = false;
            newValidation.password = "Please enter password";
        }
        if (!isValid) {
            setValidation(newValidation);
            return;
        }
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
            {message && <div style={{ height: "5vh", margin: "auto", border: "1px solid black", width: "30%", marginTop: "5%", display: "flex", alignItems: "center", justifyContent: "center", color: message.includes('success') ? 'Green' : 'Red' }}>{message}</div>}
            <div className='card'>
                <form onSubmit={handleSubmit}>
                    <div className='inputboxDiv'>
                        <input placeholder='USERNAME' className='inputTag' name='name' type="text" onChange={handleChange} value={userData.name} style={{ borderColor: validation.name ? "red" : "" }} autoComplete='off' />
                        {validation.name && <div className='validationDiv'>{validation.name}</div>}
                    </div>
                    <div className='inputboxDiv'>
                        <input placeholder='EMAIL ID' className='inputTag' name='email' type="email" onChange={handleChange} value={userData.email} style={{ borderColor: validation.email ? "red" : "" }} autoComplete='off' />
                        {validation.email && <div className='validationDiv'>{validation.email}</div>}
                    </div>
                    <div className='inputboxDiv'>
                        <input placeholder='PHONE NO' className='inputTag' name='phone' type="number" onChange={handleChange} value={userData.phone} style={{ borderColor: validation.phone ? "red" : "" }} autoComplete='off' />
                        {validation.phone && <div className='validationDiv'>{validation.phone}</div>}
                    </div>
                    <div className='inputboxDiv'>
                        <input placeholder='PASSWORD' className='inputTag' name='password' type="password" onChange={handleChange} value={userData.password} style={{ borderColor: validation.password ? "red" : "" }} autoComplete='off' />
                        {validation.password && <div className='validationDiv'>{validation.password}</div>}
                    </div>
                    {/* <div style={{ height: "5vh", border: "1px solid black", width: "100%", marginTop: "10%" }}><select placeholder='PHONE NO' style={{ height: "100%", width: "60%", marginLeft: "20%" }} name='role' onChange={handleChange} value={userData.role}>
                        <option >Select</option>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select></div> */}
                    <div className='buttonDiv'>
                        <button onClick={() => redirect('/login')}>Login</button>
                        <button type='submit'>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
