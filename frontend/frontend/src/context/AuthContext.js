import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { config } from "../Constants";
const AuthContext = createContext();

const url = config.url.API_URL;

/*
const pythonAnyWhereRegisterURL = "https://johng.pythonanywhere.com/register";
const devRegisterURL = "http://localhost:8000/register";

const pythonAnyWhereTokenURL = "https://johng.pythonanywhere.com/api/token/";
const devTokenURL = "http://localhost:8000/api/token/";

const pythonAnyWhereTokenRefreshURL =
    "https://johng.pythonanywhere.com/api/token/refresh/";
const devTokenRefreshURL = "http://localhost:8000/api/token/refresh/";

const pythonAnyWhereUserURL = "https://johng.pythonanywhere.com/users/";
const devUserURL = `http://localhost:8000/users/`;
*/
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [contextError, setContextError] = useState(null);

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
        const response = await fetch(`${url}/register`, {
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
    };

    const loginUser = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/api/token/`, {
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
            navigate("/");
        } else {
            alert("Invalid Login Credentials");
        }

        //can also check response
        //console.log("response", response);
    };

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

        const response = await fetch(`${url}/users/${userId}/`, options);
        const data = await response.json();
        setProfileData(data);
    };

    const changeAvatar = async (e) => {
        e.preventDefault();

        const userId = user.user_id;
        const avatarFile = e.target.files[0];

        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const response = await fetch(`${url}/users/${userId}/`, {
            method: "PATCH",
            headers: {
                //"Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();
        //setProfileAvatar([]);
        setProfileAvatar(data);
    };

    const deleteAvatar = async (e) => {
        //e.preventDefault();
        const userId = user.user_id;
        //const fileValue = e.target.value;
        //console.log("file value", fileValue);

        const response = await fetch(`${url}/users/${userId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ delete_avatar: true }),
        });
        const data = await response.json();
        //setProfileAvatar([]);

        setProfileAvatar(data);
    };
    /*
    const removeOrderItem = (items, orderId, setState) => {
        const newList = items.filter((item) => item.id === orderId);
        setState(newList);
    };
    */

    const deleteOrderItem = async (e, orderId) => {
        e.preventDefault();
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ order_item_id: orderId }),
        };
        const response = await fetch(
            `${url}/order-item/${orderId}/`,
            requestOptions
        );
        if (response.body && response.body.locked) {
            console.log("Order Item has been deleted.");
        }
    };

    const updateStockOnDelete = async (
        orderId,
        itemId,
        itemDetailList,
        items
    ) => {
        const orderItemId = items.find((item) => item.id === orderId);
        const singleItem = itemDetailList.find((x) => x.id === itemId);

        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                stock:
                    Number(orderItemId.item_detail.stock) +
                    Number(orderItemId.quantity),
            }),
        };
        const response = await fetch(`${url}/items/${itemId}/`, requestOptions);

        const data = await response.json();
        console.log("Item data", data);
        //removeOrderItem(id, items, orderId);
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
        try {
            const response = await fetch(`${url}/api/token/refresh/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });
            if (!response.ok) {
                throw new Error("API request failed.");
            }
            const data = await response.json();

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
        } catch (error) {
            console.log(error.message);
            setContextError(error.message);
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
        contextError: contextError,
        registerUser: registerUser,
        user: user,
        loginUser: loginUser,
        userProfile: userProfile,
        profileData: profileData,
        changeAvatar: changeAvatar,
        deleteAvatar: deleteAvatar,
        profileAvatar: profileAvatar,
        deleteOrderItem: deleteOrderItem,
        updateStockOnDelete: updateStockOnDelete,
        //removeOrderItem: removeOrderItem,
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
