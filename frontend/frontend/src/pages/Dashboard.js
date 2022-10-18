import React, { useState } from "react";

export const Dashboard = () => {
    const [whoami, setWhoami] = useState("I dont know!");
    const [error, setError] = useState("");

    return (
        <>
            <div className="container">Dashboard</div>
        </>
    );
};

export default Dashboard;
