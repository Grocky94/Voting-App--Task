import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { AuthContext } from '../context/Auth';
import { useNavigate } from 'react-router-dom';
import "../App.css"
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
            {message && <div className='customeMessage' style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
            <div className='candidateTable' >
                {state?.user?.vote === false ? <form>
                    <div className='candidatedetail'>
                        <div className='candidatedetail-inputDiv'>Vote</div>
                        <div className="candidatedetail-name" >Candidate Name</div>
                    </div>
                    {candidate.map((rep) => (
                        <div className='candidatedetail' key={rep._id}>
                            <div className='candidatedetail-inputDiv'>
                                <input type='radio' name='candidate' value={rep._id} onChange={() => setOptionSelected(rep._id)} checked={optionSelected === rep._id} />
                            </div>
                            <div className="candidatedetail-name" >
                                {rep.representor}
                            </div>
                        </div>))}
                    <button className='voteButton' style={{}} onClick={(e) => applyVote(optionSelected, e)}>Vote</button>
                </form> :
                    <div className='alreadyMadeVoteDiv'> You have already made your vote !! thank you for your active enrollment</div>}
            </div>
        </div>
    )
}

export default Home
