import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SavedItem from '../components/SavedItem';

const AddOrder = () => {
    const [savedItem, setSavedItem] = useState([]);
    const [user, setUser] = useState([]);
    const [item, setItem] = useState([]);
    const params = useParams();
    const savedId = params.savedId;

    useEffect(() => {
      getSavedItem();
    }, [savedId]);

    const getSavedItem = async () => {
      const response = await fetch(`http://127.0.0.1:8000/order-item/${savedId}/`)
      const data = await response.json();
      console.log('Data', data);
      console.log('Customer', data.customer)
      setSavedItem(data);
      setUser(data.customer);
      setItem(data.item)
    }

    return (
        <div className="items">
            <div className="items-header">
	              <h2 className="items-title">Items</h2>
	          </div>
	          <div className="notes-list">
	              <div>
	                  <SavedItem key={savedItem.id} item={savedItem} user={user} r_items={item}/>
		            </div>
	          </div>
	     </div>
    );
}

export default AddOrder;
