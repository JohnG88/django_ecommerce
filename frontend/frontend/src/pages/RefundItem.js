import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import AuthContext from "../context/AuthContext";
import ItemList from "../components/ItemList";
import InputGroup from "react-bootstrap/InputGroup";
const RefundItem = () => {
    const { accessToken } = useContext(AuthContext);
    const [orderItem, setOrderItem] = useState([]);
    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(0);
    const [itemQuantityNumber, setItemQuantityNumber] = useState(0);
    const [itemQuantReturnNum, setItemQuantReturnNum] = useState(0);
    const [valueInput, setValueInput] = useState(0);

    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.orderItemId;
    //const [numberReturn, setNumberReturn] = useState(0)

    useEffect(() => {
        if (
            itemQuantityNumber !== undefined &&
            itemQuantReturnNum !== undefined
        ) {
            getOrderItem();
        }
    }, [itemQuantityNumber, itemQuantReturnNum]);

    const getOrderItem = async () => {
        const response = await fetch(
            `http://localhost:8000/refund-item/${itemId}/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        setOrderItem(data);
        console.log("Order item", data);
        //const itemDetail = data.map((s_item) => s_item.item_detail);
        const itemDetail = data.item_detail;
        setItem(itemDetail);
        setValueInput(orderItem.quantity - orderItem.quantity_returned);
        setItemQuantityNumber(data.quantity);
        setItemQuantReturnNum(data.quantity_returned);
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
        const response = await fetch(
            `http://localhost:8000/refund-item/${itemId}/`,
            {
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
            }
        );

        const data = await response.json();
        console.log("refunded data", data);
        navigate(`/refund-confirm/${itemId}`);
    };

    //console.log("returned items", numItemsReturned);

    //const itemQuantityNumber =

    return (
        <>
            <Container>
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

                <div className="d-flex justify-content-evenly div-single-refund-info mt-5">
                    <Card className="card-single-refund-info">
                        <div className="d-flex">
                            <Col>
                                {" "}
                                <Card.Img
                                    src={item.image}
                                    className="refund-image-item"
                                />
                            </Col>
                            <Col>
                                <div>
                                    <p>{item.description}</p>
                                    <p>{item.price}</p>
                                </div>
                            </Col>
                            <Col className="input-refund-div">
                                <p>
                                    {initialNumber} items available for return.
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
                                    <InputGroup.Text>Qty.</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </div>
                    </Card>
                    <Card className="d-flex justify-content-center align-items-center refund-btn-div">
                        <Container>
                            {" "}
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
                                    <div>{totalNumber.toFixed(2)}</div>
                                    <Form onSubmit={(e) => handleSubmit(e)}>
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

                                        <Button variant="primary" type="submit">
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
    );
};

export default RefundItem;
