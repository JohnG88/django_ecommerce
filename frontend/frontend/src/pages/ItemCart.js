import React, {useState, useEffect} from 'react';
import SavedItem from '../components/SavedItem';

const ItemCart = () => {
  const [items, setItems] = useState([]);
  //const [orderedItems, setOrderedItems] = useState([])

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    const response = await fetch("http://127.0.0.1:8000/order-item/");
    const data = await response.json();
    console.log('Data', data.results);
    //const itemDetail = data.results.map(item => item.item);
    // const dataResults = data.results;
    // console.log("Items", itemDetail);
    setItems(data.results);
    // console.log("Item items", items.itemDetail);
    //setOrderedItems({items: data.result})
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <div>
            <SavedItem user={item.customer} item={item} r_items={item.item} />
          </div>
        </div>
      ))}
    </div>
  );

}

export default ItemCart;
