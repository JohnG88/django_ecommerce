import React, {useState, useEffect, useContext} from 'react';
import { Link, useParams } from "react-router-dom";
import ItemList from "../components/ItemList";

const Detail = () => {
    const params = useParams();
    const itemId = params.detailId;
    const [ item, setItem ] = useState([]);

    useEffect(() => {
        getItem();
    }, [itemId]);
    
     const getItem = async () => {
        const response = await fetch(`http://127.0.0.1:8000/items/${itemId}`);
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
	            <button>Purchase Item</button>
		</div>
	    </div>
	</div>
    );
    
}

export default Detail
