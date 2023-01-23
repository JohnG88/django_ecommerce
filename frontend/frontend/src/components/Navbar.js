import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
//import { UserContext } from "./UserLoggedInContext";

export default function Navbar() {
    const navigate = useNavigate();
    let { user, logoutUser } = useContext(AuthContext);

    // useEffect(() => {
    //   logout();
    // }, [userData]);
    /*  
    const logout = () => {
        fetch("http://localhost:8000/logout", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setUserData("");
                navigate("/home");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    */

    return (
        <>
            <div className="topnav">
                <li>
                    <Link to="/home">Home</Link>
                </li>
                {user ? (
                    <>
                        <a href="#">
                            <li onClick={logoutUser}>Logout</li>
                        </a>
                        <li>{user.username}</li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
                <li>
                    <Link to="/order-item/">Item Cart</Link>
                </li>
            </div>
        </>
    );
}
