import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import SavedItem from "../components/SavedItem";
import AuthContext from "../context/AuthContext";
import { config } from "../Constants";

const url = config.url.API_URL;

const AddOrder = () => {
    const { accessToken } = useContext(AuthContext);
    const [savedItem, setSavedItem] = useState([]);
    const [user, setUser] = useState([]);
    const [item, setItem] = useState([]);
    const params = useParams();
    const savedId = params.savedId;
    /*
    const pythonAnywhereOrderItemURL =
        "https://johng.pythonanywhere.com/order-item/";
    const devOrderItemURL = `http://localhost:8000/order-item/${savedId}/`;
    */
    useEffect(() => {
        getSavedItem();
    }, [savedId]);

    const getSavedItem = async () => {
        const response = await fetch(`${url}/order-item/${savedId}/`, {
            credentials: "include",
        });
        const data = await response.json();
        setSavedItem(data);
        setUser(data);
        setItem(data);
    };

    return (
        <div className="items">
            <div className="items-header">
                <h2 className="items-title">Items</h2>
            </div>
            <div className="notes-list">
                <div>
                    <SavedItem
                        key={savedItem.id}
                        item={savedItem}
                        user={user}
                        r_items={item}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddOrder;
