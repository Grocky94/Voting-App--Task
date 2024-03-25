import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Auth';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [message, setMessage] = useState('');// for custome message
    const [dataToCorrect, setDataToCorrect] = useState({ name: "" })// it is for edit name
    const [data, setData] = useState({ name: "" })// it is for adding new candidate
    const [list, setList] = useState([]); // it is for maping all backend candidates
    const [selected, setSelected] = useState(null); // manage state to open edit div
    const [newCan, setNewCan] = useState(false);
    const redirect = useNavigate();
    const { state } = useContext(AuthContext);


    const dashboad = async () => {
        try {
            const response = await axios.get("http://localhost:5000/voteList");
            if (response?.data?.success) {
                setList(response.data.representor);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        dashboad();
    }, []);


    // function for edit div open 
    const selectedHandleChange = (id) => {
        setSelected(id);
    }
    // function for edit div close
    const unSelectedHandleChange = () => {
        setSelected(null);
    }
    // function to open ui to add new candidate
    const openAddDiv = () => {
        setNewCan(true)
    }
    // function to close ui to add new candidate
    const closeAddDiv = () => {
        setNewCan(false)

    }
    // for edit function 
    const handleEditChange = (event) => {
        setDataToCorrect({ ...dataToCorrect, [event.target.name]: event.target.value })
    }
    const editCandidateName = async (event, id) => {
        event.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.patch("http://localhost:5000/update", { representor_id: id, token, name: dataToCorrect.name });
            setMessage(response.data.message);
            setDataToCorrect({ name: "" });
            dashboad();
            unSelectedHandleChange();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // for add new candidiate
    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    const addCandidate = async (event) => {
        event.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post("http://localhost:5000/addRep", { token, representor: data.name });
            if (response?.data?.success) {
                setMessage(response.data.message);
                setData({ name: "" });
                dashboad();
                closeAddDiv();
            }
        } catch (error) {
            setMessage(error);
        }
    };

    const deleteSingleCandidate = async (id) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.post("http://localhost:5000/deleteSelectedCandidate", { token, representor_id: id });
            if (response?.data?.success) {
                setMessage(response.data.message);
                dashboad()
            }
        } catch (error) {
            console.log(error);
        }
    }
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
            {message && <div className='customeMessage' style={{ color: message.includes('success') ? 'Green' : 'Red' }}>{message}</div>}
            <div style={{ width: "60%", border: "1px solid black", margin: "auto", marginTop: "5%", marginBottom: "5%", display: "flex", flexDirection: "column", boxSizing: "border-box", paddingBottom: "2%" }}>
                <div style={{ border: "1px solid black", height: "5vh", width: "100%", display: "flex", alignContent: "center", marginTop: "2%", justifyContent: "end" }}>
                    <button style={{ marginRight: "5%", width: "5%", backgroundColor: "white", outline: "none", borderColor: "grey" }} onClick={openAddDiv}>
                        <i class="fa-solid fa-user-plus"></i>
                    </button>
                </div>
                <div
                    style={{ height: "5vh", width: "90%", margin: "auto", border: "1px solid black", marginTop: "2%", display: "flex", boxSizing: "border-box" }}>
                    <div style={{ height: "100%", width: "40%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>CANDIDATE </div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center", }}>vote count</div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>edit</div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>delete all</div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>reset all</div>
                </div>
                {list && list.map((member) => <div key={member._id}
                    style={{ height: "5vh", width: "90%", margin: "auto", border: "1px solid black", marginTop: "2%", marginBottom: selected === member._id ? "5%" : "0.5%", display: "flex", position: "relative" }}>
                    <div style={{ height: "100%", width: "40%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>{member.representor} </div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>{member.result}</div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => selectedHandleChange(member._id)}><i className="fa-solid fa-pen-to-square"></i></div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => deleteSingleCandidate(member._id)}><i className="fa-solid fa-trash"></i></div>
                    <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}><i className="fa-solid fa-arrows-rotate"></i></div>

                    {/* to show empty input to edit */}
                    {selected === member._id &&
                        (<div>
                            <form onSubmit={(event) => editCandidateName(event, member._id)} style={{ height: "5vh", width: "100%", border: "1px solid black", marginTop: "6%", display: "flex", position: "absolute", left: "0", zIndex: "1" }}>
                                <div style={{ height: "100%", width: "40%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}><input style={{ height: '85%', width: "98%" }} name='name' type='text' onChange={handleEditChange} value={dataToCorrect.name} /></div>
                                <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}>{member.result}</div>
                                <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}></div>
                                <div style={{ height: "100%", width: "15%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}></div>
                                <div style={{ height: "100%", width: "10%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}><input type='submit' value="Save" style={{ height: '85%', width: "98%" }} /></div>
                                <div style={{ height: "100%", width: "5%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={unSelectedHandleChange}><i className="fa-solid fa-xmark"></i></div>
                            </form>
                        </div>)}
                </div>
                )}
                {/* to show when adding a new candidate */}
                {newCan && <div>
                    <form onSubmit={addCandidate} style={{ height: "5vh", width: "90%", margin: "auto", border: "1px solid black", marginTop: "2%", marginBottom: "1%", display: "flex" }}>
                        <div style={{ height: "100%", width: "85%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}><input style={{ height: '85%', width: "98%" }} name='name' type='text' onChange={handleChange} value={data.name} /> </div>
                        <div style={{ height: "100%", width: "10%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }}><input type='submit' value="add" style={{ height: '85%', width: "98%" }} /></div>
                        <div style={{ height: "100%", width: "5%", border: "1px solid black", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={closeAddDiv}><i className="fa-solid fa-xmark"></i></div>
                    </form>
                </div>}
            </div>
        </div >
    )
}

export default AdminPage
