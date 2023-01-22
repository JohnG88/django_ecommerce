import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LoginA = () => {
    const { loginUser } = useContext(AuthContext);

    // Can get username and password using e.target.username.value, e.target.password.value
    return (
        <div>
            <form onSubmit={loginUser}>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                />
                <input type="submit" />
            </form>
        </div>
    );
};

export default LoginA;
