import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Profile = () => {
    //const { user, accessToken } = useContext(AuthContext);
    const {
        userProfile,
        profileData,
        changeAvatar,
        profileAvatar,
        deleteAvatar,
    } = useContext(AuthContext);

    const ref = useRef();

    console.log("profile page avatar", profileAvatar);

    //const [userData, setUserData] = useState([]);
    //console.log("profile page function", userProfile);
    //console.log("profile page data", profileData);

    useEffect(() => {
        userProfile();
    }, [profileAvatar]);

    const handleRef = () => {
        ref.current.value = "";
    };

    /*
    const userProfile = async () => {
        //e.preventDefault();
        const userId = user.user_id;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await fetch(
            `http://localhost:8000/users/${userId}/`,
            options
        );
        const data = await response.json();
        console.log("profile response", data);
        setUserData(data);
    };
    */

    return (
        <>
            <h1>No</h1>
            <img
                className="profile-image"
                src={profileData.avatar}
                width="150px"
                height="150px"
            />
            <div>
                <label htmlFor="avatar-file">Custom avatar file</label>
            </div>
            <div>
                <input
                    id="avatar-file"
                    style={{ visibility: "hidden" }}
                    type="file"
                    ref={ref}
                    onChange={changeAvatar}
                />
            </div>
            <div>
                <button
                    onClick={(e) => {
                        deleteAvatar();
                        handleRef();
                    }}
                >
                    Delete Avatar
                </button>
            </div>
            <h4>User id: {profileData.id}</h4>
            <h4>User age: {profileData.age}</h4>
            <h4>Hello {profileData.username}</h4>
            <Link to="/shipping">Addresses</Link>
            {/*
            <h2>Hello {userData.username}</h2>

            <h4>User id: {userData.id}</h4>
            <h4>User age: {userData.age}</h4>
            */}
        </>
    );
};

export default Profile;
