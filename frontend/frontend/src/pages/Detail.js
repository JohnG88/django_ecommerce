import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ItemList from "../components/ItemList";

const Detail = () => {
    const params = useParams();
    const itemId = params.detailId;
    const [csrftoken, setCsrftoken] = useState("");
    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(1);
    console.log("Number", number);

    useEffect(() => {
        getItem();
        getCSRFToken();
    }, [itemId]);

    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                setCsrftoken(csrfToken);
                console.log("csrf", csrfToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
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
        console.log("Item Data", data);
        updateItem();
    };

    const getItem = async () => {
        const response = await fetch(`http://localhost:8000/items/${itemId}`);
        const data = await response.json();
        console.log("Data", data);
        setItem(data);
    };

    const updateItem = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
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
