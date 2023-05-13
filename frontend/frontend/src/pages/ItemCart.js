import React, { useState, useEffect, useContext } from "react";
//import SavedItem from "../components/SavedItem";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
//import Dropdown from "react-bootstrap/Dropdown";
//import DropdownButton from "react-bootstrap/DropdownButton";
import AuthContext from "../context/AuthContext";
import { config } from "../Constants";

const url = config.url.API_URL;

const ItemCart = () => {
    const { accessToken, deleteOrderItem, updateStockOnDelete } =
        useContext(AuthContext);
    const [items, setItems] = useState(null);
    //const [csrftoken, setCsrftoken] = useState("");
    const [itemDetailList, setItemDetailList] = useState("");
    //const [selectedOptions, setSelectedOptions] = useState(0);

    //const [numberForDelete, setNumberForDelete] = useState(1);
    const [total, setTotal] = useState(0);
    const [spinner, setSpinner] = useState(false);
    //const [isLoading, setIsLoading] = useState(null);
    //const [showButton, setShowButton] = useState(false);
    const [changedItemId, setChangedItemId] = useState(null);
    //const [isInputValid, setIsInputValid] = useState(true);

    useEffect(() => {
        getCartItems();
    }, []);

    // Some code for a later date
    /*
    <DropdownButton
        key={item.id}
        id={item.id}
        variant="dark"
        title={selectedOptions[item.id] || `Num ${item.quantity}`}
    >
        {selectNumList(item.item_detail.stock, item.id)}
    </DropdownButton>;
    */

    /*
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
    */

    const getCartItems = async () => {
        //setIsLoading(true);
        setSpinner(true);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await fetch(`${url}/order-item/`, requestOptions);
        const data = await response.json();
        const itemDetail = data.map((item) => item.item_detail);
        const itemTotal = data.map((item) => item.get_total_item_price);
        const stringToNum = itemTotal.map((str) => {
            return Number(str);
        });

        //const quantityInOrder = data.map((num) => num.quantity);

        // Add , 0 to reduce to not get TypeError: Reduce of empty array with no initial value.
        const totalPrice = stringToNum.reduce((total, item) => total + item, 0);

        //const totalPrice2 = itemTotal.map((a) =>
        //    JSON.parse(a).reduce((acc, curr) => acc + curr)
        //);
        //console.log("Item total reducer 2", totalPrice2);
        //const itemResults = data.item_detail;
        setItems(data);
        setItemDetailList(itemDetail);
        setTotal(totalPrice.toFixed(2));
        //setShowButton(false);

        setTimeout(() => {
            setSpinner(false);
        }, 1000);

        //setIsLoading(false);
    };

    const handleDelete = (e, orderId, itemId) => {
        updateStockOnDelete(orderId, itemId, itemDetailList, items);
        deleteOrderItem(e, orderId);
        removeItem(orderId);
    };

    //const numberList = Array.from({ length: 10 }, (_, index) => index + 1);
    //console.log("number list", numberList);

    /*
    const handleDelete = async (e, id, itemId) => {
        e.preventDefault();
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
        };
        const response = await fetch(`${url}/order-item/${id}`, requestOptions);
        removeItem(id);
        updateStockOnDelete(itemId, id);
        // const data = await response.json();
        //console.log("delete data", data);
    };
    */

    function removeItem(id) {
        const newList = items.filter((item) => item.id !== id);
        setItems(newList);
    }
    /*
    const handleSelect = (id, value) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [id]: value,
        }));

        console.log("selected option", selectedOptions);
    };
    */
    /*
    const handleSelect = (eventKey) => {
        console.log("options", eventKey);
        setSelectedOptions(eventKey);
    };
    */

    function handleQuantityChange(itemId, newQuantity) {
        //setShowButton(true);
        const updatedItems = items.map((item) => {
            if (item.id === itemId) {
                //setIsInputValid(newQuantity < item.item_detail.stock_limit);
                const prevQuantity = Number(item.quantity);
                const newStock =
                    item.item_detail.stock +
                    (prevQuantity - Number(newQuantity));
                const isInputValid = newQuantity < item.item_detail.stock_limit;
                const hasQuantityChanged = prevQuantity !== Number(newQuantity);
                const showButton = hasQuantityChanged && isInputValid;
                return {
                    ...item,
                    quantity: Number(newQuantity),
                    item_detail: { ...item.item_detail, stock: newStock },
                    showButton: showButton,
                };
            } else {
                return item;
            }
        });
        setChangedItemId(itemId);
        setItems(updatedItems);
    }

    //console.log("item id outside", changedItemId);
    /*
    function handleQuantityChange(itemId, newQuantity) {
        setItems(
            items.map((item) => {
                console.log("item dot id", item.id);
                console.log("itemId", itemId);
                if (item.id === itemId) {
                    const prevQuantity = item.quantity;
                    console.log("prev quantity", prevQuantity);
                    const newStock =
                        item.item_detail.stock + (prevQuantity - newQuantity);
                    console.log("newStock", newStock);
                    const updatedItem = {
                        ...item,
                        quantity: newQuantity,
                        item_detail: { ...item.item_detail, stock: newStock },
                    };
                    if (newQuantity <= item.item_detail.stock) {
                        setChangedItemId(itemId);
                        handleSubmit(updatedItem);
                    }
                    return updatedItem;
                } else {
                    return item;
                }
            })
        );
    }
    */

    // From belo
    //const handleSubmit = async (e, itemId, orderId, number) => {
    const handleSubmit = async (e, itemId, itemOrderId) => {
        e.preventDefault();
        const singleOrder = items.find((item) => item.id === changedItemId);

        if (singleOrder.quantity === 0) {
            handleDelete(e, singleOrder.id, singleOrder.item_detail.id);
        } else if (itemOrderId === changedItemId) {
            updateItem(singleOrder);

            if (singleOrder.item_detail.stock >= 0) {
                const requestOptions = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        quantity: Number(singleOrder.quantity),
                        item: singleOrder.item_detail.url,
                    }),
                };
                const response = await fetch(
                    `${url}/order-item/${singleOrder.id}/`,
                    requestOptions
                );
                const data = await response.json();

                //if (!data.detail) {
                getCartItems();
                //}
            } else {
                throw new Error(
                    "Item's stock limit is " +
                        singleOrder.item_detail.stock +
                        "."
                );
            }
        }
    };

    const updateItem = async (order) => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                stock: Number(order.item_detail.stock),
            }),
        };
        const response = await fetch(
            `${url}/items/${order.item_detail.id}/`,
            requestOptions
        );
        const data = await response.json();
    };

    /*
    const maxStock = (stockNum, itemQuantity) => {
        console.log("stock num", stockNum);
        const num = itemQuantity;
        if (stockNum != 0) {
            return num + 1;
        } else {
            return num;
        }
    };
    */

    /*
    const selectNumList = (nums) => {
        const numList = Array.from({ length: nums }, (_, index) => index + 1);

        return numList.map((num, index) => (
            <Dropdown.Item eventKey={num} onSelect={handleSelect}>
                Num {num}
            </Dropdown.Item>
        ));
    };

    const updateStockOnChange = (orderId, itemId) => {
        updateStockOnDelete(orderId, itemId, itemDetailList, items);
    };
    */

    /*
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
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                stock: singleItem.stock + orderItemId.quantity,
            }),
        };
        const response = await fetch(`${url}/items/${id}/`, requestOptions);
        const data = await response.json();
        console.log("Update json", data);
        //getCartItems();
        // setItemDetailList(data);
    };
    */
    //console.log("Item detail", items.item_detail);
    //june 7, 23, jul 6, 21?, aug 4, 19, 30, sep 16

    // Item Cart

    return (
        <Container className="mt-5 mb-5 d-flex justify-content-center">
            {spinner ? (
                <>
                    <Spinner></Spinner>
                </>
            ) : (
                <>
                    {items === null ? (
                        <></>
                    ) : items.length >= 1 ? (
                        <>
                            <section className="d-flex align-items-baseline justify-content-around mt-5 item-cart-div">
                                <section>
                                    <Table
                                        striped="columns"
                                        className="shop-cart-table"
                                    >
                                        <thead>
                                            <tr>
                                                <th>
                                                    <h1>Shopping Cart</h1>
                                                </th>
                                            </tr>
                                        </thead>
                                        {items.map((item) => (
                                            <tbody key={item.id}>
                                                <tr>
                                                    <td>
                                                        <Row>
                                                            <Col>
                                                                <Card.Img
                                                                    className="mt-2 mb-2 cart-item-img"
                                                                    src={
                                                                        item
                                                                            .item_detail
                                                                            .image
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>
                                                                    {
                                                                        item
                                                                            .item_detail
                                                                            .name
                                                                    }
                                                                </p>
                                                                <p>
                                                                    {
                                                                        item
                                                                            .item_detail
                                                                            .description
                                                                    }
                                                                </p>{" "}
                                                                <div className="qty-btn-group">
                                                                    <div className="mb-2">
                                                                        <Form>
                                                                            <InputGroup className="item-purchase-input">
                                                                                <Form.Control
                                                                                    type="number"
                                                                                    inputMode="numeric"
                                                                                    id="number2"
                                                                                    min={
                                                                                        1
                                                                                    }
                                                                                    max={
                                                                                        item
                                                                                            .item_detail
                                                                                            .stock_limit
                                                                                    }
                                                                                    value={
                                                                                        item.quantity
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleQuantityChange(
                                                                                            item.id,
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <InputGroup.Text>
                                                                                    Qty.
                                                                                </InputGroup.Text>{" "}
                                                                            </InputGroup>
                                                                        </Form>
                                                                    </div>
                                                                    {item.showButton && (
                                                                        <div className="mb-2">
                                                                            <Button
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleSubmit(
                                                                                        e,
                                                                                        item
                                                                                            .item_detail
                                                                                            .id,
                                                                                        item.id
                                                                                    )
                                                                                }
                                                                                style={{
                                                                                    width: "95%",
                                                                                }}
                                                                            >
                                                                                Update
                                                                            </Button>
                                                                        </div>
                                                                    )}

                                                                    <div>
                                                                        <Form>
                                                                            <Button
                                                                                style={{
                                                                                    width: "95%",
                                                                                }}
                                                                                variant="danger"
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleDelete(
                                                                                        e,
                                                                                        item.id,
                                                                                        item
                                                                                            .item_detail
                                                                                            .id
                                                                                    )
                                                                                }
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </Form>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </Table>

                                    <div className="subtotal-div">
                                        <h5>Subtotal: ${total}</h5>
                                    </div>
                                </section>
                                <div className="main-subtotal-div">
                                    <Container className="subtotal-container">
                                        <Card className="subtotal-side-card d-flex justify-content-center align-items-center">
                                            <Row className="mb-4">
                                                <h5>Subtotal: ${total}</h5>
                                            </Row>
                                            <Row>
                                                <Link to="/ordered-items/">
                                                    <Button
                                                        className="p-checkout-btn"
                                                        variant="warning"
                                                    >
                                                        Proceed to checkout
                                                    </Button>
                                                </Link>
                                            </Row>
                                        </Card>
                                    </Container>

                                    <div className="mobile-checkout-div">
                                        <Link to="/ordered-items/">
                                            <Button
                                                className="mobile-checkout-btn"
                                                variant="warning"
                                            >
                                                Proceed to checkout
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="no-items-cart">
                            <h2>No items in Cart.</h2>

                            <Link to="/">
                                <Button className="mb-5" variant="info">
                                    Add some items
                                </Button>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default ItemCart;
