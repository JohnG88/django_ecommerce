import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ItemList from "../components/ItemList";
import AuthContext from "../context/AuthContext";
import { config } from "../Constants";

const url = config.url.API_URL;

const HomePage = () => {
    const [items, setItems] = useState([]);
    const { accessToken } = useContext(AuthContext);

    const [spinner, setSpinner] = useState(null);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        setSpinner(true);
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch(`${url}/items/`, options);
        const data = await response.json();
        setItems(data);

        setTimeout(() => {
            setSpinner(false);
        }, 1000);
    };

    return (
        <div className="mt-4 mb-5">
            {spinner === null ? (
                <></>
            ) : spinner ? (
                <>
                    <Spinner></Spinner>
                </>
            ) : (
                <Container>
                    <h1>Store</h1>
                    <div className="main-home-div">
                        {items.map((item) => (
                            <ItemList key={item.id} item={item} />
                        ))}
                    </div>
                </Container>
            )}
        </div>
    );
};

export default HomePage;
