import React, { useContext } from 'react'
import "../App.css"
import { AuthContext } from '../context/Auth'

const Profile = () => {
    const { state } = useContext(AuthContext)
    console.log("state:", state)
    return (
        <div>
            <div id="profile-card">
                <div className='profile-card-header'>
                    <h3>Profile Details</h3>
                </div>
                <div>
                    <div className="profile-detail"><span>Full Name</span><span>{state?.user?.name}</span></div>
                    <div className="profile-detail"><span>Mobile Number</span><span>{state?.user?.phone}</span></div>
                    <div className="profile-detail"><span>Email ID</span><span>{state?.user?.email}</span></div>
                    <div className="profile-detail"><span>Type</span><span>{state?.user?.role}</span></div>
                </div>
            </div>
        </div>
    )
}

export default Profile
