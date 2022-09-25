import React from "react";

const SavedItem = ({ user, item, r_items }) => {
    return (
        <div className="ordered-item">
            <h5>{user.username}</h5>
            <img src={r_items.image} style={{ width: 100, height: 100 }} />
            <p>{r_items.name}</p>
            <p>{item.quantity}</p>
            <p>{item.get_total_item_price}</p>
        </div>
    );
};

export default SavedItem;
