import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ItemList from "../components/ItemList";

const Detail = () => {
    const params = useParams();
    const itemId = params.detailId;
    const [csrftoken, setCsrftoken] = useState("");
    const [item, setItem] = useState([]);

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
                //customer: "http://127.0.0.1:8000/users/1/",
                item: item.url,
            }),
        };
        const response = await fetch(
            "http://localhost:8000/order-item/",
            requestOptions
        );
        const data = await response.json();
        console.log("Item Data", data);
    };

    const getItem = async () => {
        const response = await fetch(`http://localhost:8000/items/${itemId}`);
        const data = await response.json();
        console.log("Data", data);
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
                    <Link to={`/order-item/${item.id}`}>
                        <button onClick={handleSubmit}>Purchase Item</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Detail;
