import { useContext, useState } from "react"
import { AuthContext } from "../context/Auth"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { state, dispatch } = useContext(AuthContext);
    console.log("state:", state);
    const [message, setMessage] = useState('');
    const redirect = useNavigate();

    // console.log("state:", state)
    const logOut = () => {
        const token = JSON.parse(localStorage.getItem('token'))

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
            {state?.user && <div style={{ border: "1px solid black", height: "8vh", width: "100%", display: "flex", }}>
                <div style={{ height: "100%", width: "20%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginRight: 0 }}>
                    {state.user.role} - {state.user.name}
                </div>
                <div style={{ height: "100%", width: "20%", border: "1px solid black", marginLeft: "0%", marginRight: 0, display: "flex", justifyContent: "center" }}>
                    <button style={{ height: "100%", width: "60%" }} onClick={logOut}>Log Out</button>
                </div>
            </div >}
            {message && <div style={{ height: "5vh", margin: "auto", border: "1px solid black", width: "30%", marginTop: "5%", marginBottom: "-7%", display: "flex", alignItems: "center", justifyContent: "center", color: message.includes('success') ? 'red' : 'Green' }}>{message}</div>}
        </>
    )
}
export default Navbar

