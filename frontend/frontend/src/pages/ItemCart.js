import React, { useState, useEffect } from "react";
import SavedItem from "../components/SavedItem";
import { Link } from "react-router-dom";

const ItemCart = () => {
    const [items, setItems] = useState([]);
    const [csrftoken, setCsrftoken] = useState("");
    const [itemDetailList, setItemDetailList] = useState("");
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getCartItems();
        getCSRFToken();
    }, []);

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

    const getCartItems = async () => {
        //console.log("csrf", csrftoken);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        };

        const response = await fetch(
            "http://localhost:8000/order-item/",
            requestOptions
        );
        const data = await response.json();
        console.log("Data", data);
        const itemDetail = data.map((item) => item.item_detail);
        const itemTotal = data.map((item) => item.get_total_item_price);
        const stringToNum = itemTotal.map((str) => {
            return Number(str);
        });
        console.log("Convert", stringToNum);

        // Add , 0 to reduce to not get TypeError: Reduce of empty array with no initial value.
        const totalPrice = stringToNum.reduce((total, item) => total + item, 0);

        //const totalPrice2 = itemTotal.map((a) =>
        //    JSON.parse(a).reduce((acc, curr) => acc + curr)
        //);
        //console.log("Item total reducer 2", totalPrice2);
        const itemResults = data.item_detail;
        console.log("Items", itemDetail);
        console.log("Items total", itemTotal);
        console.log("Items total reducer", totalPrice);
        setItems(data);
        setItemDetailList(itemDetail);
        setTotal(totalPrice.toFixed(2));
    };

    console.log("Item items", itemDetailList);

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
            `http://localhost:8000/order-item/${id}`,
            requestOptions
        );
        removeItem(id);
        updateStockOnDelete(itemId, id);
        // const data = await response.json();
        //console.log("delete data", data);
    };

    const removeItem = async (id) => {
        const newList = items.filter((item) => item.id !== id);
        setItems(newList);
    };

    const updateStockOnDelete = async (id, orderId) => {
        const singleItem = itemDetailList.find((x) => x.id === id);
        const orderItemId = items.find((item) => item.id === orderId);
        // setItemDetailList(singleItem);
        console.log("Single item", singleItem);
        console.log("Quantity", orderItemId);
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
            body: JSON.stringify({
                stock: singleItem.stock + orderItemId.quantity,
            }),
        };
        const response = await fetch(
            `http://localhost:8000/items/${id}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("Update json", data);
        getCartItems();
        // setItemDetailList(data);
    };
    //console.log("Item detail", items.item_detail);
    //june 7, 23, jul 6, 21?, aug 4, 19, 30, sep 16
    return (
        <div>
            {items.length > 0 ? (
                <>
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
                                        <p>Order id: {item.id}</p>
                                        <p>
                                            item number: {item.item_detail.id}
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                    <h3>Total: {total}</h3>
                </>
            ) : (
                <p>No items in Cart</p>
            )}
            <Link to="/ordered-items/">
                <button>View Order</button>
            </Link>
        </div>
    );
};

export default ItemCart;
