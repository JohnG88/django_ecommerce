import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ItemList from "../components/ItemList";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
    const [items, setItems] = useState([]);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch("http://localhost:8000/items/", options);
        const data = await response.json();
        console.log("Data", data);
        setItems(data);
    };

    return (
        <>
            <h1>Store</h1>
            <div className="mt-5 mb-5" style={{ width: "100%" }}>
                Empty space
            </div>
            <Row>
                <Col sm={4}>Some data</Col>
                <Col sm={8}>
                    <Row md={2} xs={1} lg={4}>
                        {items.map((item) => (
                            <Col sm key={item.id} style={{ width: "15rem" }}>
                                <ItemList item={item} />
                                <Link to={`/detail/${item.id}`}>
                                    <Button className="flush-button">
                                        Detail View
                                    </Button>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default HomePage;
