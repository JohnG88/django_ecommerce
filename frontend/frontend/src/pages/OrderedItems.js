import React, { useEffect, useLayoutEffect, useState } from "react";

const OrderItems = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/order/",
            requestOptions
        );
        const data = await response.json();
        console.log("Data", data);
        setItems(data);
    };

    return (
        <div>
            <h4>Ordered Items</h4>
        </div>
    );
};

export default OrderItems;
