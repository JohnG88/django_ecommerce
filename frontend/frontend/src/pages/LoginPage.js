import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserLoggedInContext";

const Login = () => {
    const navigate = useNavigate();
    const userRef = useRef();
    const [csrftoken, setCsrftoken] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useContext(UserContext);
    const devURL = "http://localhost:8000/csrf";
    const pyAnywhereUEL = "http://johng.pythonanywhere.com/csrf";
    useEffect(() => {
        userRef.current.focus();
        getCSRFToken();
    }, []);

    const getCSRFToken = () => {
        fetch(pythonAnywhereURL, {
            credentials: "include",
            // withCredentials: true,
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                setCsrftoken(csrfToken);
                console.log("csrf ", csrfToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    //console.log("csrf ", csrftoken);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            body: JSON.stringify({ username: user, password: password }),
        };
        const response = await fetch(
            "http://localhost:8000/login",
            requestOptions
        );
        const data = await response.json();
        console.log("Login Data", data);
        setUserData(data);
        navigate("/home");
    };

    return (
        <section>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label html="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <button>Sign In</button>
            </form>
        </section>
    );
};

export default Login;
