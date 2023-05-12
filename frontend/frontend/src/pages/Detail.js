import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ItemList from "../components/ItemList";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import AuthContext from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { config } from "../Constants";

const url = config.url.API_URL;
const Detail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.detailId;
    //const [csrftoken, setCsrftoken] = useState("");
    const { accessToken } = useContext(AuthContext);
    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(1);
    const [orderCreated, setOrderCreated] = useState("");
    const [spinner, setSpinner] = useState(null);

    useEffect(() => {
        getItem();
    }, []);

    const getItem = async () => {
        setSpinner(true);
        const response = await fetch(`${url}/items/${itemId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        setItem(data);
        setTimeout(() => {
            setSpinner(false);
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                quantity: number,
                item_id: item.id,
                item: item.url,
            }),
        };
        const response = await fetch(`${url}/order-item/`, requestOptions);
        const data = await response.json();
        setOrderCreated(data);
        if (!data.detail) {
            updateItem();
            navigate("/order-item/");
        }
    };

    const updateItem = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                stock: item.stock - number,
            }),
        };

        const response = await fetch(`${url}/items/${itemId}/`, requestOptions);
        const data = await response.json();
        setItem(data);
    };

    return (
        <Container className="mt-5 d-flex justify-content-around main-detail-container">
            {spinner === null ? (
                <></>
            ) : spinner ? (
                <Spinner></Spinner>
            ) : (
                <div className="d-flex justify-content-around inner-detail-div">
                    <Card className="detail-img-div">
                        <div className="d-flex main-detail-info">
                            <Card.Img
                                className="detail-card-div"
                                src={item.image}
                            />
                            <Card>
                                <div>
                                    <div className="d-flex">
                                        <span className="ms-1 mt-2">$</span>
                                        <span className="price">
                                            {item.price}
                                        </span>
                                    </div>
                                    <p>{item.description}</p>
                                    <p>Stock available: {item.stock}</p>
                                </div>
                            </Card>
                        </div>
                    </Card>
                    <div>
                        {item.stock > 0 ? (
                            <>
                                <Card className="detail-item-form">
                                    <Container>
                                        <Form onSubmit={handleSubmit}>
                                            <InputGroup className="item-purchase-input mt-2">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    onChange={(e) =>
                                                        setNumber(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={number}
                                                    max={item.stock}
                                                />
                                                <InputGroup.Text>
                                                    Qty.
                                                </InputGroup.Text>
                                            </InputGroup>

                                            <Button
                                                className="mt-2 place-to-cart-btn"
                                                type="submit"
                                                variant="primary"
                                            >
                                                Place to Cart
                                            </Button>
                                        </Form>
                                    </Container>
                                </Card>
                            </>
                        ) : (
                            <h5>Out of stock</h5>
                        )}
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Detail;
