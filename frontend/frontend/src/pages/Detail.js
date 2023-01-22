import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ItemList from "../components/ItemList";

import AuthContext from "../context/AuthContext";

const Detail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.detailId;
    //const [csrftoken, setCsrftoken] = useState("");
    const { accessToken } = useContext(AuthContext);
    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(1);
    const [orderCreated, setOrderCreated] = useState("");

    useEffect(() => {
        getItem();
        //getCSRFToken();
    }, []);

    /*
    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                setCsrftoken(csrfToken);
                console.log("csrf", csrfToken);
                console.log("res", res.headers);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    */
    const getItem = async () => {
        const response = await fetch(`http://localhost:8000/items/${itemId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        console.log("Data", data);
        setItem(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                quantity: number,
                item: item.url,
            }),
        };
        const response = await fetch(
            "http://localhost:8000/order-item/",
            requestOptions
        );
        const data = await response.json();
        console.log("order Item Data", data);
        setOrderCreated(data);
        if (!data.detail) {
            updateItem();
            navigate("/order-item/");
        }
    };

    const updateItem = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                stock: item.stock - number,
            }),
        };

        const response = await fetch(
            `http://localhost:8000/items/${itemId}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("updated item", data);
        setItem(data);
    };

    return (
        <div className="items">
            <div className="items-header">
                <h2 className="items-title">Items</h2>
            </div>
            <div className="notes-list">
                <div>
                    <ItemList key={item.id} item={item} />
                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            id="number"
                            min="1"
                            onChange={(e) => setNumber(e.target.value)}
                            value={number}
                            max={item.stock}
                        />
                        <button>Purchase Item</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Detail;
