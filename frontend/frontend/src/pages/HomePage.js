import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ItemList from "../components/ItemList";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
    const [items, setItems] = useState([]);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch("http://localhost:8000/items/", options);
        const data = await response.json();
        console.log("Data", data);
        setItems(data);
    };

    return (
        <div className="items">
            <div className="items-header">
                <h2 className="items-title">Items</h2>
            </div>
            <div className="notes-list">
                {items.map((item) => {
                    return (
                        <div key={item.id}>
                            <ItemList key={item.id} item={item} />
                            <Link to={`/detail/${item.id}`}>Detail View</Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HomePage;
