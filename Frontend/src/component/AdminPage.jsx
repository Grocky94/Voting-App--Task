import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Auth';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [message, setMessage] = useState('');
    const [list, setList] = useState([]);
    const redirect = useNavigate();
    const { state } = useContext(AuthContext);
    console.log("state:", state)

    useEffect(() => {
        async function dashboad() {
            try {
                const response = await axios.get("http://localhost:5000/voteList");
                if (response?.data?.success) {
                    setList(response.data.representor);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        dashboad();
    }, []);

    useEffect(() => {
        if (state && state.user) {
            if (state.user.role === 'Admin') {
                //show them this page
            } else {
                setMessage('Page not accessible');
                redirect('/login');
            }
        }
    }, [state, redirect])

    setTimeout(() => {
        setMessage('');
    }, 2000);

    return (
        <div>
            {message && <div style={{ height: "5vh", margin: "auto", border: "1px solid black", width: "30%", marginTop: "5%", marginBottom: "-7%", display: "flex", alignItems: "center", justifyContent: "center", color: message.includes('success') ? 'Green' : 'Red' }}>{message}</div>}
            <div style={{ width: "30%", border: "1px solid black", margin: "auto", marginTop: "5%" }}>
                <div
                    style={{ height: "5vh", width: "90%", margin: "auto", border: "1px solid black", marginTop: "2%", display: "flex" }}>
                    <div style={{ height: "100%", width: "70%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>CANDIDATE </div>
                    <div style={{ height: "100%", width: "30%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>VOTE COUNT</div>
                </div>
                {list && list.map((member) => <div key={member._id}
                    style={{ height: "5vh", width: "90%", margin: "auto", border: "1px solid black", marginTop: "2%", marginBottom: "1%", display: "flex" }}>
                    <div style={{ height: "100%", width: "70%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>{member.representor} </div>
                    <div style={{ height: "100%", width: "30%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>{member.result}</div>
                </div>)}
            </div>
        </div>
    )
}

export default AdminPage
