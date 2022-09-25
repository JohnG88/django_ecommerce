import React, { useState, useEffect } from "react";
import SavedItem from "../components/SavedItem";

const ItemCart = () => {
    const [items, setItems] = useState([]);
    //const [orderedItems, setOrderedItems] = useState([])

    useEffect(() => {
        getCartItems();
    }, []);

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
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemCart;
