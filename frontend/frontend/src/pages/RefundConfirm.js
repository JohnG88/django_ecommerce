import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import AuthContext from "../context/AuthContext";

import { config } from "../Constants";

const url = config.url.API_URL;

const RefundConfirm = () => {
    const params = useParams();
    const [orderItem, setOrderItem] = useState([]);
    const [item, setItem] = useState([]);
    const [spinner, setSpinner] = useState(null);
    const { accessToken } = useContext(AuthContext);

    const itemId = params.orderItemId;

    const pythonAnywhereRefundItemURL =
        "https://johng.pythonanywhere.com/refund-item/";
    const devRefundItemURL = "http://localhost:8000/refund-item/";

    useEffect(() => {
        getOrderItems();
    }, [itemId]);

    const getOrderItems = async () => {
        setSpinner(true);
        const response = await fetch(`${url}/refund-item/${itemId}/`, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        setOrderItem(data);
        console.log("refund confirm item", data);
        const itemDetail = data.item_detail;
        setItem(itemDetail);
        setTimeout(() => {
            setSpinner(false);
        }, 1000);
    };

    const refundedAmount = orderItem.quantity_returned * item.price;

    return (
        <div className="mt-4">
            {spinner === null ? (
                <></>
            ) : spinner ? (
                <>
                    <Spinner></Spinner>
                </>
            ) : (
                <Container>
                    <div className="d-flex gap-3 justify-content-evenly refund-confirm-main-container">
                        <Card>
                            <Container>
                                <div className="gap-4 card-single-refund-info">
                                    <div>
                                        <Card.Img
                                            src={item.image}
                                            className="refund-image-item"
                                        />
                                    </div>
                                    <div>
                                        <Col>{item.name}</Col>
                                        <Col>{item.description}</Col>
                                    </div>
                                </div>
                            </Container>
                        </Card>
                        <Card className="card-refund-amount">
                            <div>
                                <p>
                                    {orderItem.quantity_returned} of{" "}
                                    {orderItem.quantity} items have been
                                    returned.
                                </p>
                                <p>
                                    Amount refunded: $
                                    {refundedAmount.toFixed(2)}
                                </p>

                                <p>
                                    <Link
                                        className="remove-link-decorations"
                                        to="/refund/"
                                    >
                                        Refund More Items
                                    </Link>
                                </p>
                                <p>
                                    <Link
                                        className="remove-link-decorations"
                                        to="/"
                                    >
                                        Continue Shopping
                                    </Link>
                                </p>
                            </div>
                        </Card>
                    </div>
                </Container>
            )}
        </div>
    );
};

export default RefundConfirm;
