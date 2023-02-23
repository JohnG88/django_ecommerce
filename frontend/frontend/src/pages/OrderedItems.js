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
import SavedItem from "../components/SavedItem";
import AuthContext from "../context/AuthContext";

const OrderItems = () => {
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    //const [csrftoken, setCsrftoken] = useState("");
    const [order, setOrder] = useState([]);
    const [customerInfo, setCustomerInfo] = useState([]);
    const [items, setItems] = useState([]);
    const [itemDetailList, setItemDetailList] = useState([]);
    const [total, setTotal] = useState("");
    const [shippingInfo, setShippingInfo] = useState([]);
    const [billingInfo, setBillingInfo] = useState([]);
    const [itemIdNum, setItemidNum] = useState([]);
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        getOrderedItems();
        getShipping();
        //getCards();
        //getCSRFToken();
    }, []);

    /*
    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                console.log("csrf", csrfToken);
                setCsrftoken(csrfToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    */

    const getCards = async () => {
        const response = await fetch("http://localhost:8000/cards", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        console.log("cards", data);
    };

    const getShipping = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            //credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/shipping/",
            requestOptions
        );
        const data = await response.json();
        const shipping_address = data.filter(
            (item) => item.address_type == "S" && item.default == true
        );
        const billing_address = data.filter(
            (item) => item.address_type == "B" && item.default == true
        );
        setShippingInfo(shipping_address);
        setBillingInfo(billing_address);
        console.log("Shipping data", data);
    };

    const getOrderedItems = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            //credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/order/",
            requestOptions
        );
        const data = await response.json();
        console.log("Data", data);
        setOrder(data);
        const allOrderedItems = data.map((item) => setItems(item.order_items));
        //const allOrderedItems = data.map((item) => item.order_items);
        const singleOrderItems = items.map((item) => item.item_detail);
        const allTotal = data.map((item) => setTotal(item.get_total));
        const info = data.map((customer) => customer.get_address);
        //const idNum = data.map((num) => )
        setCustomerInfo(info);
        setItemDetailList(singleOrderItems);
    };
    console.log("Order", order);

    console.log("item orders", items);
    console.log("Single order items", itemDetailList);

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
        const response = await fetch(
            `http://localhost:8000/order-item/${id}/`,
            requestOptions
        );
        // removeItem(id);
        updateStockOnDelete(itemId, id);
        getOrderedItems();
    };

    //const removeItem = async (id) => {
    //    const newList = items.filter((item) => item.id !== id);
    //    setItems(newList);
    //};

    const updateStockOnDelete = async (id, orderId) => {
        const orderItemId = items.find((item) => item.id === orderId);
        const stockValue = orderItemId.item_detail.stock;

        console.log("Single Item", stockValue);
        console.log("quantity", orderItemId);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                stock: stockValue + orderItemId.quantity,
            }),
        };
        const response = await fetch(
            `http://localhost:8000/items/${id}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("update data", data);
        getOrderedItems();
    };
    //u/Fine_Bench9084

    // Function update with array of numbers
    //const updateAPIs = async (ids) => {

    //    ids.forEach(id => {
    //        const itemId = items.find((item) => item.id === id);
    //        const stockNum = itemId.item_detail.sold;
    //        const itemQuantity = itemId.quantity;
    //        const response = await fetch(`http://localhost:8000/items/${id}`,
    //            method: "PUT",
    //            headers: {
    //                "Content-Type": "application/json",
    //                "X-CSRFToken": csrftoken,
    //            },
    //            credentials: "include",
    //            body: JSON.stringify({
    //                sold: stockNum + itemQuantity,
    //            }),
    //        const data = await response.json();
    //        console.log("Multiple item data", data)
    //    }))
    //}

    const updateItemAPIs = (ids) => {
        ids.forEach((id) => {
            console.log("IDS", ids);
            const itemId = items.find((item) => item.id === id);
            console.log("Item id", itemId);
            const originalItemId = itemId.item_detail.id;
            const stockNum = itemId.item_detail.sold;
            console.log("Stock num", stockNum);
            const itemQuantity = itemId.quantity;
            console.log("Item quantity", itemQuantity);
            const response = fetch(
                `http://localhost:8000/items/${originalItemId}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        //"X-CSRFToken": csrftoken,
                    },
                    //credentials: "include",
                    body: JSON.stringify({
                        sold: stockNum + itemQuantity,
                    }),
                }
            );
            //const data = response.json();
            //console.log("Multi item update with order confirmation.", data);
        });
    };

    //const updateStockOnOrder = async (id, orderId) => {
    //    const orderItemId = items.find((item) => item.id === orderId);
    //    //console.log("Order item id", orderItemId);
    //    const soldValue = orderItemId.item_detail.sold;
    //    console.log("sold value", soldValue);
    //    const requestOptions = {
    //        method: "PUT",
    //        headers: {
    //            "Content-Type": "application/json",
    //            "X-CSRFToken": csrftoken,
    //        },
    //        credentials: "include",
    //        body: JSON.stringify({
    //            sold: soldValue + orderItemId,
    //        }),
    //    };
    //    const response = await fetch(
    //        `http://localhost:8000/items/${id}`,
    //        requestOptions
    //    );
    //    const data = await response.json();
    //    console.log("Updated sold number", data);
    //};

    console.log("Customer INfo", customerInfo);
    console.log("order", order);

    const updateOrder = async (e) => {
        e.preventDefault();
        const itemIds = items.map((item) => item.id);
        console.log("Item id array", itemIds);
        const orderId = order.map((num) => num.id);
        const date = new Date();

        const card = elements.getElement(CardElement);

        const { paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: card,
        });

        console.log("order id", orderId);
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                ordered: true,
                ordered_date: date,
                payment_method_id: paymentMethod.id,
            }),
        };
        const response = await fetch(
            `http://localhost:8000/order/${orderId}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("Updated data", data);
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

    return (
        <Container>
            <div className="mt-5 mb-3 d-flex gap-3 justify-content-evenly align-items-baseline">
                <div>
                    <Row className="mb-3">
                        <Col>
                            <h3>Shipping address</h3>
                        </Col>
                        <Col>
                            {shippingInfo.map((info) => (
                                <div key={info.id}>
                                    <div>
                                        <p>
                                            {info.address}, {info.apt},{" "}
                                            {info.city}, {info.state},{" "}
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
                    {items.length > 0 ? (
                        <>
                            <h4 className="mb-3">Review Items</h4>
                            {items.map((item) => (
                                <Card className="mb-2" key={item.id}>
                                    <Row>
                                        <Col>
                                            <div>
                                                <Card.Img
                                                    src={item.item_detail.image}
                                                    style={{ width: "200px" }}
                                                />
                                            </div>
                                        </Col>
                                        <Col className="mid-col-checkout">
                                            <p>{item.item_detail.name}</p>
                                            <p>
                                                {item.item_detail.description}
                                            </p>{" "}
                                            <Form>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="number"
                                                        id="number2"
                                                        min={1}
                                                        max={item.quantity}
                                                        value={item.quantity}
                                                    />
                                                    <InputGroup.Text>
                                                        Qty.
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <div>
                                                <form>
                                                    <button
                                                        onClick={(e) =>
                                                            handleDelete(
                                                                e,
                                                                item.id,
                                                                item.item_detail
                                                                    .id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                    <p>
                                                        Order item id: {item.id}
                                                    </p>
                                                    <p>
                                                        item number:{" "}
                                                        {item.item_detail.id}
                                                    </p>
                                                </form>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}{" "}
                        </>
                    ) : (
                        <p>No items to order.</p>
                    )}
                </div>
                <Card className="payment-div">
                    <div className="order-sum-content">
                        <h3>Order Summary</h3>
                        <p className="order-sum-p">Items</p>
                        <p className="order-sum-p">Shipping and Handling</p>
                        <p className="order-sum-p">Total before tax:</p>
                        <p className="order-sum-p">
                            Estimated tax to be collected:
                        </p>
                    </div>
                    <hr />
                    <div className="order-sum-content">
                        <h5>Order total: {total}</h5>
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
                                options={{
                                    style: {
                                        base: inputStyle,
                                    },
                                }}
                            />
                            <div className="card-error" role="alert">
                                {error}
                            </div>
                        </div>
                        <Button variant="success" type="submit">
                            Place Order
                        </Button>
                    </Form>
                    {/*<form>
                        <PaymentElement />
                    </form>*/}
                </Card>
            </div>

            {/*
            {customerInfo.map((u_address) => (
                <div key={u_address.id}>
                    <p>{u_address.address}</p>
                </div>
            ))}
            */}

            {/*
                    <Link to={"/billing/"}>
                        <div>
                            {billingInfo.map((info) => (
                                <div key={info.id}>
                                    <div className="ship-info-div">
                                        <p>Billing address.</p>
                                        <p>
                                            {info.address}, {info.apt},{" "}
                                            {info.city}, {info.state},{" "}
                                            {info.zipcode}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Link>
                    */}
        </Container>
    );
};

export default OrderItems;
