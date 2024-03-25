import { useContext, useState } from "react"
import { AuthContext } from "../context/Auth"
import { useNavigate } from "react-router-dom";
import "../App.css"
const Navbar = () => {
    const [isShown, setIsShown] = useState(false);
    const { state, dispatch } = useContext(AuthContext);
    console.log("state:", state);
    const [message, setMessage] = useState('');
    const redirect = useNavigate();


    const openLogin = () => {
        setIsShown(true);
    };
    const submitLog = () => {
        setIsShown(false);
    };
    // console.log("state:", state)
    const logOut = () => {
        const token = JSON.parse(localStorage.getItem('token'))
        submitLog();
        if (token) {
            localStorage.removeItem("token")
            dispatch({
                type: "Logout"
            })

            setMessage("User got LogOut");
            redirect("/login")
        }
        setTimeout(() => {
            setMessage('');
        }, 2000);
    }
    return (
        <>
            <div className="nav">
                <div className="logo" onClick={() => redirect('/')}>
                    <img src="data:image/png;base64,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" />
                </div>
                {state?.user && <div className='navbar-log' onClick={openLogin}>
                    {state.user.name}
                </div>}
                {isShown && (<div className='dropdown' >
                    <div className="dropdown-child" onClick={() => redirect('/profile')}>Profile</div>
                    <div className="dropdown-child" onClick={logOut} >LOGOUT</div>
                </div>)}
            </div >
            {message && <div className='customeMessage' style={{ color: message.includes('success') ? 'red' : 'Green' }}>{message}</div>}
        </>
    )
}
export default Navbar

