import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DisableWindow = () => {
    const [message, setMessage] = useState('');// for custome message
    const [winnerName, setwinnername] = useState([]);// show name of candidate 
    const [winnerScore, setWinnerScore] = useState([])// show score of candidate

    const ResultCandidate = async () => {
        setMessage("Voting window has been disabled");
        try {
            const response = await axios.get("http://localhost:5000/getresult");
            if (response?.data?.success) {
                const { highestResult, highestResultCandidateName } = response.data;
                setWinnerScore([highestResult]);
                setwinnername(Array.isArray(highestResultCandidateName) ? highestResultCandidateName : [highestResultCandidateName]);

            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    }
    useEffect(() => {
        ResultCandidate();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('');
        }, 2000);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <>
            {message && <div className='customeMessage' style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
            <div style={{ border: "1px solid grey", marginTop: "12vh", width: "50%", marginLeft: "25%", borderRadius: "10px", boxShadow: "2px 2px 10px 10px #FFC4C4", overflow: "hidden" }}>
                <div style={{ height: "30vh", fontSize: "1em", textAlign: "center" }}>
                    <img style={{ height: "100%", width: "100%", objectFit: "inherit" }} src='https://cdn.pixabay.com/photo/2022/08/21/15/06/winner-7401528_640.png' />
                </div>
                <div style={{ border: "1px solid wheat", height: "10vh", fontSize: "1.2em", textAlign: "center", display: "flex", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#FFF6F6", color: "grey" }}>
                    <div style={{ width: "30%" }}>Candidate Name</div> <div style={{ width: "30%" }}>Votes Won By</div>
                </div>
                {winnerName && winnerName.map((name, index) => <div key={index} style={{ height: "10vh", fontSize: "1em", alignItems: "center", display: "flex", justifyContent: "space-evenly", color: "rgb(220, 113, 113)", fontWeight: "600" }}>
                    <div style={{ width: "30%" }}>{name}</div><div style={{ width: "30%", textAlign: "center" }}>{winnerScore[index]}</div>
                </div>)}
            </div>
        </>

    )
}

export default DisableWindow;
