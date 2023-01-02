import React, { useState, useEffect } from "react";

const OrderPlaced = () => {
    const [csrftoken, setCsrftoken] = useState("");
    const [order, setOrder] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        getCSRFToken();
        getOrder();
    }, []);

    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                console.log("csrf", csrfToken);
                setCsrftoken(csrfToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getOrder = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/order-placed/",
            requestOptions
        );
        const data = await response.json();
        console.log("Data", data);
        setOrder(data);
        const allOrderedItems = data.map((item) =>
            setOrderItems(item.order_items)
        );
        //const allOrderedItems = data.map((item) => item.order_items);
        //const singleOrderItems = items.map((item) => item.item_detail);
        //const allTotal = data.map((item) => setTotal(item.get_total));
        //const info = data.map((customer) => customer.get_address);
        //const idNum = data.map((num) => )
        //setCustomerInfo(info);
        //setItemDetailList(singleOrderItems);
    };

    return (
        <>
            <h4>Thank you for your purchase.</h4>
            {order.map((info) => (
                <div key={info.id}>
                    <p>Order id: {info.id}</p>
                    <p>
                        Address: {info.get_address.address} Apt{" "}
                        {info.get_address.apt} {info.get_address.city},{" "}
                        {info.get_address.state} {info.get_address.zipcode}
                    </p>
                    {orderItems.map((data) => (
                        <div key={data.id}>
                            <p>Order items id: {data.id}</p>
                            <p>Order item name: {data.item_detail.name}</p>
                            <p>Quantity: {data.quantity}</p>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};

export default OrderPlaced;
