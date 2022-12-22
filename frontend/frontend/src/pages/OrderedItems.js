import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SavedItem from "../components/SavedItem";

const OrderItems = () => {
    const [csrftoken, setCsrftoken] = useState("");
    const [order, setOrder] = useState([]);
    const [customerInfo, setCustomerInfo] = useState([]);
    const [items, setItems] = useState([]);
    const [itemDetailList, setItemDetailList] = useState([]);
    const [total, setTotal] = useState("");
    const [shippingInfo, setShippingInfo] = useState([]);
    const [billingInfo, setBillingInfo] = useState([]);
    const [itemIdNum, setItemidNum] = useState([]);

    useEffect(() => {
        getOrderedItems();
        getShipping();
        getCSRFToken();
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

    const getShipping = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/shipping/",
            requestOptions
        );
        const data = await response.json();
        const shipping_address = data.filter(
            (item) => item.address_type == "S" && item.default == true
        );
        const billing_address = data.filter(
            (item) => item.address_type == "B" && item.default == true
        );
        setShippingInfo(shipping_address);
        setBillingInfo(billing_address);
        console.log("Shipping data", data);
    };

    const getOrderedItems = async () => {
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
        setOrder(data);
        const allOrderedItems = data.map((item) => setItems(item.order_items));
        //const allOrderedItems = data.map((item) => item.order_items);
        const singleOrderItems = items.map((item) => item.item_detail);
        const allTotal = data.map((item) => setTotal(item.get_total));
        const info = data.map((customer) => customer.get_address);
        //const idNum = data.map((num) => )
        setCustomerInfo(info);
        setItemDetailList(singleOrderItems);
    };
    console.log("Order", order);

    console.log("item orders", items);
    console.log("Single order items", itemDetailList);

    const handleDelete = async (e, id, itemId) => {
        e.preventDefault();
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
        };
        const response = await fetch(
            `http://localhost:8000/order-item/${id}/`,
            requestOptions
        );
        // removeItem(id);
        updateStockOnDelete(itemId, id);
        getOrderedItems();
    };

    //const removeItem = async (id) => {
    //    const newList = items.filter((item) => item.id !== id);
    //    setItems(newList);
    //};

    const updateStockOnDelete = async (id, orderId) => {
        const orderItemId = items.find((item) => item.id === orderId);
        const stockValue = orderItemId.item_detail.stock;

        console.log("Single Item", stockValue);
        console.log("quantity", orderItemId);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            body: JSON.stringify({
                stock: stockValue + orderItemId.quantity,
            }),
        };
        const response = await fetch(
            `http://localhost:8000/items/${id}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("update data", data);
        getOrderedItems();
    };
    //u/Fine_Bench9084

    // Function update with array of numbers
    //const updateAPIs = async (ids) => {

    //    ids.forEach(id => {
    //        const itemId = items.find((item) => item.id === id);
    //        const stockNum = itemId.item_detail.sold;
    //        const itemQuantity = itemId.quantity;
    //        const response = await fetch(`http://localhost:8000/items/${id}`,
    //            method: "PUT",
    //            headers: {
    //                "Content-Type": "application/json",
    //                "X-CSRFToken": csrftoken,
    //            },
    //            credentials: "include",
    //            body: JSON.stringify({
    //                sold: stockNum + itemQuantity,
    //            }),
    //        const data = await response.json();
    //        console.log("Multiple item data", data)
    //    }))
    //}

    const updateItemAPIs = (ids) => {
        ids.forEach((id) => {
            console.log("IDS", ids);
            const itemId = items.find((item) => item.id === id);
            console.log("Item id", itemId);
            const originalItemId = itemId.item_detail.id;
            const stockNum = itemId.item_detail.sold;
            console.log("Stock num", stockNum);
            const itemQuantity = itemId.quantity;
            console.log("Item quantity", itemQuantity);
            const response = fetch(
                `http://localhost:8000/items/${originalItemId}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        sold: stockNum + itemQuantity,
                    }),
                }
            );
            //const data = response.json();
            //console.log("Multi item update with order confirmation.", data);
        });
    };

    //const updateStockOnOrder = async (id, orderId) => {
    //    const orderItemId = items.find((item) => item.id === orderId);
    //    //console.log("Order item id", orderItemId);
    //    const soldValue = orderItemId.item_detail.sold;
    //    console.log("sold value", soldValue);
    //    const requestOptions = {
    //        method: "PUT",
    //        headers: {
    //            "Content-Type": "application/json",
    //            "X-CSRFToken": csrftoken,
    //        },
    //        credentials: "include",
    //        body: JSON.stringify({
    //            sold: soldValue + orderItemId,
    //        }),
    //    };
    //    const response = await fetch(
    //        `http://localhost:8000/items/${id}`,
    //        requestOptions
    //    );
    //    const data = await response.json();
    //    console.log("Updated sold number", data);
    //};

    console.log("Customer INfo", customerInfo);
    console.log("order", order);

    const updateOrder = async (e) => {
        e.preventDefault();
        const itemIds = items.map((item) => item.id);
        console.log("Item id array", itemIds);
        const orderId = order.map((num) => num.id);
        const date = new Date();

        console.log("order id", orderId);
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            body: JSON.stringify({ ordered: true, ordered_date: date }),
        };
        const response = await fetch(
            `http://localhost:8000/order/${orderId}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("Updated data", data);
        updateItemAPIs(itemIds);
    };

    return (
        <div>
            {order.map((info) => (
                <p>Order id: {info.id}</p>
            ))}
            {items.map((item) => (
                <div key={item.id}>
                    <div>
                        <SavedItem
                            user={item.customer}
                            item={item}
                            r_items={item.item_detail}
                        />
                        <div>
                            <form>
                                <button
                                    onClick={(e) =>
                                        handleDelete(
                                            e,
                                            item.id,
                                            item.item_detail.id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                                <p>Order item id: {item.id}</p>
                                <p>item number: {item.item_detail.id}</p>
                            </form>
                        </div>
                    </div>
                </div>
            ))}

            <div>
                <h4>Total: ${total}</h4>
            </div>
            {/*
            {customerInfo.map((u_address) => (
                <div key={u_address.id}>
                    <p>{u_address.address}</p>
                </div>
            ))}
            */}
            <form onSubmit={updateOrder}>
                <button>Place Order</button>
            </form>
            <Link to={"/shipping/"}>
                <div>
                    {shippingInfo.map((info) => (
                        <div key={info.id}>
                            <div className="ship-info-div">
                                <p>Shipping address.</p>
                                <p>
                                    {info.address}, {info.apt}, {info.city},{" "}
                                    {info.state}, {info.zipcode}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Link>
            <Link to={"/billing/"}>
                <div>
                    {billingInfo.map((info) => (
                        <div key={info.id}>
                            <div className="ship-info-div">
                                <p>Billing address.</p>
                                <p>
                                    {info.address}, {info.apt}, {info.city},{" "}
                                    {info.state}, {info.zipcode}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Link>
        </div>
    );
};

export default OrderItems;
