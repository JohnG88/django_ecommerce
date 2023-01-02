import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserLoggedInContext";

export function Navbar() {
    const [userData, setUserData] = useContext(UserContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //   logout();
    // }, [userData]);

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

    return (
        <>
            <div className="topnav">
                <li>
                    <Link to="/">Home</Link>
                </li>
                {userData.user ? (
                    <>
                        <a href="#">
                            <li onClick={logout}>Logout</li>
                        </a>
                        <li>{userData.user}</li>
                    </>
                ) : (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                )}
                <li>
                    <Link to="/order-item/">Item Cart</Link>
                </li>
            </div>
        </>
    );
}
