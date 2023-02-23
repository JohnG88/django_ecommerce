import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AuthContext from "../context/AuthContext";

const OrderPlaced = () => {
    const { accessToken } = useContext(AuthContext);
    //const [csrftoken, setCsrftoken] = useState("");
    const [order, setOrder] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        //getCSRFToken();
        getOrder();
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

    const getOrder = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            //credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/order-placed/",
            requestOptions
        );
        const data = await response.json();
        console.log("Data", data);
        setOrder(data);
        const allOrderedItems = data.map((item) =>
            setOrderItems(item.order_items)
        );
        //const allOrderedItems = data.map((item) => item.order_items);
        //const singleOrderItems = items.map((item) => item.item_detail);
        //const allTotal = data.map((item) => setTotal(item.get_total));
        //const info = data.map((customer) => customer.get_address);
        //const idNum = data.map((num) => )
        //setCustomerInfo(info);
        //setItemDetailList(singleOrderItems);
    };

    return (
        <>
            <Container>
                <h4>Thank you for your purchase.</h4>
                <Row>
                    {order.map((info) => (
                        <div key={info.id}>
                            <Col>
                                <Card>
                                    <h5>
                                        Items sent to chosen Shipping Address
                                    </h5>
                                    <p>
                                        {info.get_address.address} Apt{" "}
                                        {info.get_address.apt}{" "}
                                        {info.get_address.city},{" "}
                                        {info.get_address.state}{" "}
                                        {info.get_address.zipcode}
                                    </p>
                                </Card>
                            </Col>
                            <Col>
                                {orderItems.map((data) => (
                                    <Card key={data.id}>
                                        <Row>
                                            <Col>
                                                <Card.Img
                                                    src={data.item_detail.image}
                                                />
                                            </Col>
                                            <Col>
                                                <p>
                                                    Order item name:{" "}
                                                    {data.item_detail.name}
                                                </p>

                                                <p>Quantity: {data.quantity}</p>
                                            </Col>
                                            <Col>
                                                {data.item_detail.description}
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </Col>
                        </div>
                    ))}
                </Row>
                <Link to={"/home/"}>
                    <h4>Continue Shopping</h4>
                </Link>
            </Container>
        </>
    );
};

export default OrderPlaced;
