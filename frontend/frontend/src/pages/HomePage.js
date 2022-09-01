import React, {useState, useEffect, useContext} from 'react';
import { Link } from "react-router-dom";
import ItemList from "../components/ItemList";


const HomePage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = async () => {
        const response = await fetch("http://127.0.0.1:8000/items/");
	const data = await response.json();
	console.log("Data", data.results);
	setItems(data.results);
    };
    
    return (
        <div className="items">
            <div className="items-header">
	        <h2 className="items-title">Items</h2>
	    </div>
	    <div className="notes-list">
	        {items.map((item) => {
		    return (
			<div>
	                    <ItemList key={item.id} item={item} />
			    <Link to={`/detail/${item.id}`}>Detail View</Link>
			</div>
		    );
		})}
	    </div>
	</div>
    )
}

export default HomePage;
