import React from "react";
// import { Link } from "react-router-dom";

const ItemList = ({ item }) => {
    return (
        <div className="item-list">
            <h4>{item.id}</h4>
	    <h5>{item.name}</h5>
	    <img src={item.image} style={{width:200, height: 200}}></img>
	    <p>$ {item.price}</p>
	    <p>{item.description}</p>
	    <p>In stock: {item.stock}</p>
	    <p>How many sold: {item.sold}</p>
	</div>
    );
};

export default ItemList;
