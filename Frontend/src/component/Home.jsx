import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { AuthContext } from '../context/Auth';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [candidate, setCandidate] = useState([]);
    const [message, setMessage] = useState('');
    const [optionSelected, setOptionSelected] = useState("");
    const { state } = useContext(AuthContext);
    const redirect = useNavigate();


    useEffect(() => {
        async function dashboad() {
            try {
                const response = await axios.get("http://localhost:5000/voteList");
                if (response.data.success) {
                    setCandidate(response.data.representor);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        };
        dashboad();
    }, []);

    const applyVote = async (seletor, event) => {
        event.preventDefault(); // Prevent default form submission
        console.log("selector", seletor)
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            console.log("token:", token)

            const response = await axios.post("http://localhost:5000/voting", { token, representor_id: seletor });
            console.log("response:", response)
            if (response?.data?.success) {
                setMessage(response?.data?.message)
                setOptionSelected("");
            } else {
                setMessage(response.data.message)
            }
        } catch (error) {
            setMessage(error.response.data.message)
            console.log(error);
        }

    }
    useEffect(() => {
        if (!state || !state.user || state.user.role !== 'User') {
            setMessage('Page not accessible');
            redirect('/login');
        }
    }, [state, redirect]);

    setTimeout(() => {
        setMessage('');
    }, 2000);

    return (
        <div>
            {message && <div style={{ height: "5vh", margin: "auto", border: "1px solid black", width: "30%", marginTop: "5%", marginBottom: "-7%", display: "flex", alignItems: "center", justifyContent: "center", color: message === 'success' ? 'green' : 'red' }}>{message}</div>}
            <div style={{ width: "30%", margin: "auto", border: "1px solid black", marginTop: "20vh" }}>
                <form style={{ border: "1px solid black" }}>
                    {candidate.map((rep) => (
                        <div key={rep._id} style={{ width: "90%", height: "5vh", margin: "auto", marginTop: "1%", display: "flex" }}>
                            <div style={{ height: "100%", width: "10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <input type='radio' name='candidate' value={rep._id} onChange={() => setOptionSelected(rep._id)} checked={optionSelected === rep._id} />
                            </div>
                            <div style={{ height: "100%", width: "90%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "start" }}>
                                {rep.representor}
                            </div>
                        </div>))}
                    <button style={{ height: "5vh", width: "fit-content", marginLeft: "45%", marginTop: "2%", marginBottom: "2%" }} onClick={(e) => applyVote(optionSelected, e)}>Vote</button>
                </form>
            </div>
        </div>
    )
}

export default Home
