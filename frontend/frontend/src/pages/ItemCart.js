import React, { useState, useEffect } from "react";
import SavedItem from "../components/SavedItem";

const ItemCart = () => {
    const [items, setItems] = useState([]);
    const [csrftoken, setCsrftoken] = useState("");
    //const [orderedItems, setOrderedItems] = useState([])

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
        //const itemDetail = data.results.map(item => item.item);
        // const dataResults = data.results;
        // console.log("Items", itemDetail);
        setItems(data);
        // console.log("Item items", items.itemDetail);
        //setOrderedItems({items: data.result})
    };

    const handleDelete = async (e, id) => {
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
        // const data = await response.json();
        //console.log("delete data", data);
    };

    const removeItem = async (id) => {
        const newList = items.filter((item) => item.id !== id);
        setItems(newList);
    };

    return (
        <div>
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
                                    onClick={(e) => handleDelete(e, item.id)}
                                >
                                    Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemCart;
