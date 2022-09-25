import React, { useState } from "react";

export const Dashboard = () => {
    const [whoami, setWhoami] = useState("I dont know!");
    const [error, setError] = useState("");

    React.useEffect(() => {
        fetch("http://localhost:8000/whoami", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setWhoami(data.username);
            })
            .catch((err) => {
                console.log(err);
                setError("You are not logged in");
            });
    }, []);

    const logout = () => {
        fetch("http://localhost:8000/logout", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setWhoami(data.detail);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="container">{whoami}</div>
            <div>
                <button onClick={logout}>Logout</button>
            </div>
        </>
    );
};

export default Dashboard;
