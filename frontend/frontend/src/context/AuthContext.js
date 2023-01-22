import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // get user info from access token
    //const [user, setUser] = useState(null);
    // using () =>, creates a callback function
    const [user, setUser] = useState(() =>
        localStorage.getItem("access")
            ? jwt_decode(localStorage.getItem("access"))
            : null
    );
    const [accessToken, setAccessToken] = useState(() =>
        localStorage.getItem("access")
            ? JSON.parse(localStorage.getItem("access"))
            : null
    );
    // conditional to check if token exists
    const [refreshToken, setRefreshToken] = useState(() =>
        localStorage.getItem("refresh")
            ? JSON.parse(localStorage.getItem("refresh"))
            : null
    );

    const [loading, setLoading] = useState(true);

    /* 
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
        }),
    };
    */

    const loginUser = async (e) => {
        e.preventDefault();
        console.log("Form submitted");
        const response = await fetch("http://localhost:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        });
        const data = await response.json();

        if (response.status === 200) {
            setAccessToken(data.access);
            localStorage.setItem("access", JSON.stringify(data.access));

            setRefreshToken(data.refresh);
            localStorage.setItem("refresh", JSON.stringify(data.refresh));
            setUser(jwt_decode(data.access));
            navigate("/home");
        } else {
            alert("Something went wrong");
        }

        console.log("data", data);

        //can also check response
        //console.log("response", response);
    };
    console.log("user", user);

    const logoutUser = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/login");
    };

    const updateToken = async () => {
        console.log("Updated token");
        const response = await fetch(
            "http://localhost:8000/api/token/refresh/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
            }
        );
        const data = await response.json();
        console.log("refresh data", data);

        if (response.status === 200) {
            setAccessToken(data.access);
            localStorage.setItem("access", JSON.stringify(data.access));

            setUser(jwt_decode(data.access));
        } else {
            logoutUser();
        }

        // call when loading is true on first render
        if (loading) {
            setLoading(false);
        }
    };

    // always create call to backend for refresh token 10 seconds or a minute before token expires
    useEffect(() => {
        if (loading) {
            updateToken();
        }

        const fourMinutes = 1000 * 60 * 4;
        const interval = setInterval(() => {
            if (refreshToken) {
                updateToken();
            }
        }, fourMinutes);
        // always clear interval to not get infinite loop
        return () => clearInterval(interval);
    }, [accessToken, loading]);

    const contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser,
        accessToken: accessToken,
        //updateToken: updateToken,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {/*to not render any children yet, protected routes until AuthProvider is complete*/}
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
