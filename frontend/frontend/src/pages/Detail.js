import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ItemList from "../components/ItemList";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import AuthContext from "../context/AuthContext";

const Detail = () => {
    const navigate = useNavigate();
    const params = useParams();
    const itemId = params.detailId;
    //const [csrftoken, setCsrftoken] = useState("");
    const { accessToken } = useContext(AuthContext);
    const [item, setItem] = useState([]);
    const [number, setNumber] = useState(0);
    const [orderCreated, setOrderCreated] = useState("");

    useEffect(() => {
        getItem();
        //getCSRFToken();
    }, []);

    /*
    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                setCsrftoken(csrfToken);
                console.log("csrf", csrfToken);
                console.log("res", res.headers);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    */
    const getItem = async () => {
        const response = await fetch(`http://localhost:8000/items/${itemId}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        console.log("Data", data);
        setItem(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                quantity: number,
                item: item.url,
            }),
        };
        const response = await fetch(
            "http://localhost:8000/order-item/",
            requestOptions
        );
        const data = await response.json();
        console.log("order Item Data", data);
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
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                stock: item.stock - number,
            }),
        };

        const response = await fetch(
            `http://localhost:8000/items/${itemId}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("updated item", data);
        setItem(data);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <div className="detail-card-div">
                        <Card.Img src={item.image} style={{ width: "500px" }} />
                    </div>
                </Col>
                <Col>
                    <div>
                        {item.stock > 0 ? (
                            <>
                                <Card>
                                    <p>{item.name}</p>
                                    <p>{item.description}</p>
                                    <p>Price: {item.price}</p>
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="number"
                                            id="number"
                                            min={0}
                                            onChange={(e) =>
                                                setNumber(e.target.value)
                                            }
                                            value={number}
                                            max={item.stock}
                                        />
                                        <button>Purchase Item</button>
                                    </form>
                                </Card>
                            </>
                        ) : (
                            <h5>Out of stock</h5>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Detail;
