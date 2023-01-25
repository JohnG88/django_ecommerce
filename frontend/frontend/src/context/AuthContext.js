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

    const [profileData, setProfileData] = useState(() => []);

    const [profileAvatar, setProfileAvatar] = useState([]);

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

    const registerUser = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                email: e.target.email.value,
                password: e.target.password.value,
                re_password: e.target.re_password.value,
            }),
        });
        const data = await response.json();
        console.log("register data", data);
    };

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
        setProfileData(data);
    };

    const changeAvatar = async (e) => {
        e.preventDefault();

        const userId = user.user_id;
        const avatarFile = e.target.files[0];

        const formData = new FormData();
        formData.append("avatar", avatarFile);
        console.log("avatar file name", avatarFile);

        const response = await fetch(`http://localhost:8000/users/${userId}/`, {
            method: "PATCH",
            headers: {
                //"Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();
        console.log("profile avatar", data);
        //setProfileAvatar([]);
        setProfileAvatar(data);
    };

    const deleteAvatar = async (e) => {
        //e.preventDefault();
        const userId = user.user_id;
        //const fileValue = e.target.value;
        //console.log("file value", fileValue);

        const response = await fetch(`http://localhost:8000/users/${userId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ delete_avatar: true }),
        });
        const data = await response.json();
        console.log("avatar response", response);
        console.log("avatar data", data);
        //setProfileAvatar([]);

        setProfileAvatar(data);
    };

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
        registerUser: registerUser,
        user: user,
        loginUser: loginUser,
        userProfile: userProfile,
        profileData: profileData,
        changeAvatar: changeAvatar,
        deleteAvatar: deleteAvatar,
        profileAvatar: profileAvatar,
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
