import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import AuthContext from "../context/AuthContext";
import ItemList from "../components/ItemList";
import InputGroup from "react-bootstrap/InputGroup";

import { config } from "../Constants";

const url = config.url.API_URL;

const RefundItem = () => {
    const { accessToken } = useContext(AuthContext);
    const [orderItem, setOrderItem] = useState([]);
    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(0);
    const [itemQuantityNumber, setItemQuantityNumber] = useState(0);
    const [itemQuantReturnNum, setItemQuantReturnNum] = useState(0);
    const [valueInput, setValueInput] = useState(0);
    const [spinner, setSpinner] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.orderItemId;
    //const [numberReturn, setNumberReturn] = useState(0)

    const pythonAnywhereRefundItemURL =
        "https://johng.pythonanywhere.com/refund-item/";
    const devRefundItemURL = "http://localhost:8000/refund-item/";

    useEffect(() => {
        if (
            itemQuantityNumber !== undefined &&
            itemQuantReturnNum !== undefined
        ) {
            getOrderItem();
        }
    }, [itemQuantityNumber, itemQuantReturnNum]);

    const getOrderItem = async () => {
        setSpinner(true);
        const response = await fetch(`${url}/refund-item/${itemId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        setOrderItem(data);
        console.log("Order item", data);
        //const itemDetail = data.map((s_item) => s_item.item_detail);
        const itemDetail = data.item_detail;
        setItem(itemDetail);
        setValueInput(orderItem.quantity - orderItem.quantity_returned);
        setItemQuantityNumber(data.quantity);
        setItemQuantReturnNum(data.quantity_returned);
        setTimeout(() => {
            setSpinner(false);
        }, 1000);
    };

    console.log("set quant num", itemQuantityNumber);
    console.log("set quant return num", itemQuantReturnNum);

    const totalNumber = item.price * number;
    const initialNumber =
        itemQuantityNumber - orderItem.quantity_returned - number;
    /*     
    let numForInput = itemQuantityNumber - itemQuantReturnNum;
    console.log("order quantity", orderItem.quantity);
    console.log("order quantity returned", orderItem.quantity_returned);
    console.log("num for max", numForInput);
    console.log("item quantity number", itemQuantityNumber);
    */

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/refund-item/${itemId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                refunded: true,
                number: number,
                quantity_returned: number,
            }),
        });

        const data = await response.json();
        console.log("refunded data", data);
        navigate(`/refund-confirm/${itemId}`);
    };

    //console.log("returned items", numItemsReturned);

    //const itemQuantityNumber =

    return (
        <Container className="mt-4 main-refund-div">
            {spinner === null ? (
                <></>
            ) : spinner ? (
                <>
                    <Spinner></Spinner>
                </>
            ) : (
                <>
                    <Container className="d-flex refund-item-container">
                        {/*
                {" "}
                <Col>
                    <h4>Are you sure you wish to refund the item(s)</h4>
                </Col>
                    <Card className="mt-4">
                    <Row>
                        <Col>
                            <Card.Img
                                src={item.image}
                                className="refund-image-item"
                            />
                        </Col>
                        <Col>
                            {" "}
                            <h3>{item.name}</h3>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center refund-item-form">
                            {orderItem.refunded ? (
                                <div>
                                    <h4>
                                        <Badge bg="success">
                                            Item already refunded
                                        </Badge>
                                    </h4>
                                </div>
                            ) : (
                                <div>
                                    <Form onSubmit={(e) => handleSubmit(e)}>
                                        <InputGroup className="refund-item-qi mb-2">
                                            <Form.Control
                                                type="number"
                                                id="number1"
                                                min={1}
                                                onChange={(e) =>
                                                    setNumber(e.target.value)
                                                }
                                                value={number}
                                                max={orderItem.quantity}
                                            />
                                            <InputGroup.Text>
                                                Qty.
                                            </InputGroup.Text>
                                        </InputGroup>{" "}
                                        <Button variant="primary" type="submit">
                                            Refund
                                        </Button>
                                    </Form>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card>
                */}

                        <div className="d-flex justify-content-around main-refund-item-div mt-5">
                            <Card>
                                <div className="d-flex justify-content-even align-items-center refund-div-flex">
                                    <div className="refund-item-img-col">
                                        <Card.Img
                                            src={item.image}
                                            className="refund-image-item"
                                        />
                                    </div>
                                    <div>
                                        <div>
                                            <p>{item.description}</p>
                                            <p>{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="input-refund-div">
                                        <p>
                                            {initialNumber} items available for
                                            return.
                                        </p>
                                        <InputGroup className="refund-item-qi mb-2">
                                            <Form.Control
                                                type="number"
                                                id="number1"
                                                min={0}
                                                onChange={(e) =>
                                                    setNumber(e.target.value)
                                                }
                                                value={number}
                                                max={valueInput || 0}
                                            />
                                            <InputGroup.Text>
                                                Qty.
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                </div>
                            </Card>
                            <Card className="d-flex justify-content-center align-items-center refund-btn-div">
                                <Container className="refund-item-btn-container">
                                    {" "}
                                    {orderItem.refunded ? (
                                        <div>
                                            <h4>
                                                <Badge bg="success">
                                                    Order Fully Refunded
                                                </Badge>
                                            </h4>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>{totalNumber.toFixed(2)}</div>
                                            <Form
                                                onSubmit={(e) =>
                                                    handleSubmit(e)
                                                }
                                            >
                                                {/*}
                                        <InputGroup className="refund-item-qi mb-2">
                                            <Form.Control
                                                type="number"
                                                id="number1"
                                                min={1}
                                                onChange={(e) =>
                                                    setNumber(e.target.value)
                                                }
                                                value={number}
                                                max={orderItem.quantity}
                                            />
                                            <InputGroup.Text>
                                                Qty.
                                            </InputGroup.Text>
                                        </InputGroup>{" "}
                                        */}

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                >
                                                    {" "}
                                                    Refund
                                                </Button>
                                            </Form>
                                        </div>
                                    )}
                                </Container>
                            </Card>
                        </div>
                    </Container>
                </>
            )}
        </Container>
    );
};

export default RefundItem;
