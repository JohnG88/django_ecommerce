import React, { useState, useEffect, useContext } from "react";
//import { Link } from "react-router-dom";
//import Col from "react-bootstrap/Col";
//import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
//import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import ItemList from "../components/ItemList";
import AuthContext from "../context/AuthContext";
import { config } from "../Constants";

const url = config.url.API_URL;

const HomePage = () => {
    const [items, setItems] = useState([]);
    const { accessToken } = useContext(AuthContext);

    const [spinner, setSpinner] = useState(null);
    const [error, setError] = useState(null);

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
        try {
            const response = await fetch(`${url}/items/`, options);

            if (!response.ok) {
                throw new Error("API request failed");
            }
            const data = await response.json();
            setItems(data);

            setError(null);

            setTimeout(() => {
                setSpinner(false);
            }, 1000);
        } catch (error) {
            // will give network error
            //console.log("error", error.message);

            // Can also set message to state
            setError(error.message);
        }
    };

    return (
        <div className="mt-4 mb-5">
            {error && <Alert variant="warning">{error}</Alert>}
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
