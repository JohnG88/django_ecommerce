import React, { useEffect, useState, useContext } from "react";
import {
    CardElement,
    useElements,
    useStripe,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import SavedItem from "../components/SavedItem";
import AuthContext from "../context/AuthContext";
import { config } from "../Constants";

const url = config.url.API_URL;

const OrderItems = () => {
    const navigate = useNavigate();
    const { accessToken, deleteOrderItem, updateStockOnDelete } =
        useContext(AuthContext);
    //const [csrftoken, setCsrftoken] = useState("");
    const [order, setOrder] = useState([]);
    const [customerInfo, setCustomerInfo] = useState([]);
    const [items, setItems] = useState(null);
    const [sumOfItems, setSumOfItems] = useState(0);
    const [shipping, setShipping] = useState(5.99);
    const [itemDetailList, setItemDetailList] = useState([]);
    //const [number, setNumber] = useState(1);
    const [total, setTotal] = useState(0);
    const [shippingInfo, setShippingInfo] = useState([]);
    const [billingInfo, setBillingInfo] = useState([]);
    const [itemIdNum, setItemidNum] = useState([]);
    const [error, setError] = useState(null);
    const [spinner, setSpinner] = useState(null);
    const [changedItemId, setChangedItemId] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        getOrderedItems();
        getShipping();
    }, []);

    const getShipping = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch(`${url}/shipping/`, requestOptions);
        const data = await response.json();
        const shipping_address = data.filter(
            (item) => item.address_type == "S" && item.default == true
        );
        const billing_address = data.filter(
            (item) => item.address_type == "B" && item.default == true
        );
        setShippingInfo(shipping_address);
        setBillingInfo(billing_address);
    };

    const getOrderedItems = async () => {
        setSpinner(true);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch(`${url}/order/`, requestOptions);
        const data = await response.json();
        console.log("data", data);
        const dataItems = data.order_items;

        setOrder(data);
        const allOrderedItems = data.map((item) => setItems(item.order_items));
        //const singleOrderItems = data.map((item) =>
        //    setItemDetailList(item.order_items.item_detail)
        //);

        const allTotal = data.map((item) => setTotal(item.get_total));
        const info = data.map((customer) => customer.get_address);
        if (items != null) {
            const numItems = items.map((item) => item.quantity);
            const sum = numItems.reduce((a, b) => a + b, 0);
            setSumOfItems(sum);
        }
        //console.log("numItems", numItems);
        //setNumberOfItems(getNumItems);
        setCustomerInfo(info);

        setTimeout(() => {
            setSpinner(false);
        }, 2000);
    };

    console.log("items", items);
    //console.log("q items", numberOfItems);

    //const getNumItems = items.map((item) => item.quantity);
    //console.log("num of items", getNumItems);
    /*
    const getSum = () => {
        const numItems = items.map((item) => item.quantity);
        console.log("numItems", numItems);
        const sum = numItems.reduce((a, b) => a + b, 0);
        console.log("sum", sum);
    };

    if (items != null) {
        getSum();
        console.log("getSum", getSum());
    }
    */

    const handleDelete = (e, orderId, itemId) => {
        const singleOrderItems = items.map((item) => item.item_detail);
        updateStockOnDelete(orderId, itemId, singleOrderItems, items);
        deleteOrderItem(e, orderId);
        removeItem(orderId);
    };

    const removeItem = async (id) => {
        const newList = items.filter((item) => item.id !== id);
        setItems(newList);
    };

    const updateItemAPIs = (ids) => {
        ids.forEach((id) => {
            const itemId = items.find((item) => item.id === id);
            const originalItemId = itemId.item_detail.id;
            const stockNum = itemId.item_detail.sold;
            const itemQuantity = itemId.quantity;
            const response = fetch(`${url}/items/${originalItemId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    sold: stockNum + itemQuantity,
                }),
            });
        });
    };

    /*
    function handleQuantityChange(itemId, newQuantity) {
        setItems(
            items.map((item) => {
                if (item.id === itemId) {
                    const prevQuantity = item.quantity;
                    const newStock =
                        item.item_detail.stock + (prevQuantity - newQuantity);
                    setChangedItemId(itemId);
                    return {
                        ...item,
                        quantity: newQuantity,
                        item_detail: { ...item.item_detail, stock: newStock },
                    };
                } else {
                    return item;
                }
            })
        );
    }
    */

    function handleQuantityChange(itemId, newQuantity) {
        const updatedItems = items.map((item) => {
            console.log("item dot id", item.id);
            console.log("itemId", itemId);
            if (item.id === itemId) {
                const prevQuantity = Number(item.quantity);
                console.log("item stock", item.item_detail.stock);
                console.log("prev quantity", prevQuantity);
                console.log("new quantity", newQuantity);
                console.log(
                    "sum",
                    item.item_detail.stock +
                        (prevQuantity - Number(newQuantity))
                );
                const newStock =
                    item.item_detail.stock +
                    (prevQuantity - Number(newQuantity));
                console.log("newStock", newStock);
                return {
                    ...item,
                    quantity: Number(newQuantity),
                    item_detail: { ...item.item_detail, stock: newStock },
                };
            } else {
                return item;
            }
        });
        setChangedItemId(itemId);
        setItems(updatedItems);
    }

    const handleSubmit = async (e, orderId) => {
        e.preventDefault();
        const singleOrder = items.find((item) => item.id === changedItemId);
        updateItem(singleOrder);
        console.log("single order", singleOrder);
        if (singleOrder.item_detail.stock >= 0) {
            const singleItem = singleOrder.item_detail;
            console.log("single item", singleItem);
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    //"X-CSRFToken": csrftoken,
                },
                //credentials: "include",
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
            console.log("handle submitted data", data);
            //setOrderCreated(data);
            //if (!data.detail) {
            getOrderedItems();
            //getShipping();
            //navigate("/order-item/");
            //}
        } else {
            throw new Error(
                "Item's stock limit is " + singleOrder.item_detail.stock + "."
            );
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

    const updateOrder = async (e) => {
        e.preventDefault();
        const itemIds = items.map((item) => item.id);
        const orderId = order.map((num) => num.id);
        const date = new Date();

        const card = elements.getElement(CardElement);

        const { paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: card,
        });

        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                ordered: true,
                ordered_date: date,
                payment_method_id: paymentMethod.id,
            }),
        };
        const response = await fetch(
            `${url}/order/${orderId}/`,
            requestOptions
        );
        const data = await response.json();
        updateItemAPIs(itemIds);
        setItems("");
        navigate("/order-placed/");
    };

    const handleChange = (e) => {
        if (e.error) {
            setError(e.error.message);
        } else {
            setError(null);
        }
    };

    const inputStyle = {
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: "500",
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "15px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
            color: "#fce883",
        },
        "::placeholder": {
            color: "#87BBFD",
        },
        invalid: {
            iconColor: "#FFC7EE",
            color: "#FFC7EE",
        },
    };

    const convertTotalToNum = parseFloat(total);

    const totalSum = convertTotalToNum + shipping;
    //console.log("totalSum", totalSum);
    //console.log("total", convertTotalToNum);
    //console.log("shipping", shipping);

    const caTaxRateSum = (7.25 / 100) * totalSum;
    //console.log("tax rate", caTaxRateSum);

    const fullTotalSum = totalSum + caTaxRateSum;
    //console.log("full sum", fullTotalSum);

    // Order items

    return (
        <Container className="mt-4 mb-5">
            {spinner ? (
                <>
                    <Spinner></Spinner>
                </>
            ) : (
                <>
                    {items === null ? (
                        <></>
                    ) : items.length >= 1 ? (
                        <div className="mt-5 mb-3 d-flex gap-3 justify-content-evenly align-items-baseline main-place-order-div">
                            <div className="main-ordered-items-div">
                                <Row className="mb-3 d-flex order-shipping-row">
                                    <Col>
                                        <h3>Shipping address</h3>
                                    </Col>
                                    <Col>
                                        {shippingInfo.map((info) => (
                                            <div key={info.id}>
                                                <div>
                                                    <p>
                                                        {info.address},{" "}
                                                        {info.apt}, {info.city},{" "}
                                                        {info.state},{" "}
                                                        {info.zipcode}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </Col>
                                    <Col>
                                        {" "}
                                        <Link to={"/shipping/"}>
                                            {shippingInfo.length > 0 ? (
                                                <p>Change</p>
                                            ) : (
                                                <p>Add a shipping address.</p>
                                            )}
                                        </Link>
                                    </Col>
                                </Row>
                                <hr />

                                <h4 className="mb-3">Review Items</h4>
                                {items.map((item) => (
                                    <div key={item.id}>
                                        <Card className="mb-2" key={item.id}>
                                            <Row className="purchase-item-info">
                                                <Col>
                                                    <div>
                                                        <Card.Img
                                                            src={
                                                                item.item_detail
                                                                    .image
                                                            }
                                                            style={{
                                                                width: "200px",
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col className="mid-col-checkout">
                                                    <p>
                                                        {item.item_detail.name}
                                                    </p>
                                                    <p>
                                                        {
                                                            item.item_detail
                                                                .description
                                                        }
                                                    </p>
                                                    <p>
                                                        {item.item_detail.stock}
                                                    </p>
                                                    <Form
                                                        onSubmit={(e) =>
                                                            handleSubmit(
                                                                e,
                                                                item.item_detail
                                                                    .id
                                                            )
                                                        }
                                                    >
                                                        <div className="qty-btn-group">
                                                            <InputGroup className="item-purchase-input">
                                                                <Form.Control
                                                                    type="number"
                                                                    id="number2"
                                                                    min={1}
                                                                    value={
                                                                        item.quantity
                                                                    }
                                                                    max={
                                                                        item
                                                                            .item_detail
                                                                            .stock_limit
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
                                                                </InputGroup.Text>
                                                            </InputGroup>{" "}
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
                                                            </div>{" "}
                                                            <div>
                                                                <Button
                                                                    style={{
                                                                        width: "95%",
                                                                    }}
                                                                    type="submit"
                                                                >
                                                                    Update
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Form>{" "}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                            <Card className="payment-div">
                                <div className="order-sum-content">
                                    <h3>Order Summary</h3>
                                    <p className="order-sum-p">
                                        Items Total {total}
                                    </p>
                                    <p className="order-sum-p">
                                        Shipping and Handling ${shipping}
                                    </p>
                                    <p className="order-sum-p">
                                        Total before tax: {totalSum.toFixed(2)}
                                    </p>
                                    <p className="order-sum-p">
                                        Estimated tax to be collected:{" "}
                                        {caTaxRateSum.toFixed(2)}
                                    </p>
                                </div>
                                <hr />
                                <div className="order-sum-content">
                                    <h5>
                                        Order total: {fullTotalSum.toFixed(2)}
                                    </h5>
                                </div>
                                <hr />
                                <Form onSubmit={updateOrder}>
                                    <div className="form-row">
                                        <label htmlFor="card-element">
                                            Credit or debit card
                                        </label>
                                        <CardElement
                                            id="card-element"
                                            onChange={handleChange}
                                        />
                                        <div
                                            className="card-error"
                                            role="alert"
                                        >
                                            {error}
                                        </div>
                                    </div>
                                    <Button
                                        className="p-checkout-btn"
                                        variant="success"
                                        type="submit"
                                    >
                                        Place Order
                                    </Button>
                                </Form>
                            </Card>
                        </div>
                    ) : (
                        <div className="no-items-cart">
                            <h2>No items to order.</h2>

                            <Link to="/">
                                <Button className="mb-5" variant="info">
                                    Add some items.
                                </Button>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default OrderItems;
