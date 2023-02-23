import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import AuthContext from "../context/AuthContext";

const RefundConfirm = () => {
    const params = useParams();
    const [orderItem, setOrderItem] = useState([]);
    const [item, setItem] = useState([]);
    const { accessToken } = useContext(AuthContext);

    const itemId = params.orderItemId;

    useEffect(() => {
        getOrderItems();
    }, [itemId]);

    const getOrderItems = async () => {
        const response = await fetch(
            `http://localhost:8000/refund-item/${itemId}/`,
            {
                method: "Get",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        setOrderItem(data);
        console.log("refund confirm item", data);
        const itemDetail = data.item_detail;
        setItem(itemDetail);
    };

    const refundedAmount = orderItem.quantity_returned * item.price;

    return (
        <Container>
            <div className="d-flex gap-3 justify-content-evenly">
                <Card>
                    <Container>
                        <div className="d-flex gap-4 card-single-refund-info">
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
                            {orderItem.quantity} items have been returned.
                        </p>
                        <p>Amount refunded: ${refundedAmount.toFixed(2)}</p>

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
                                to="/home/"
                            >
                                Continue Shopping
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </Container>
    );
};

export default RefundConfirm;
