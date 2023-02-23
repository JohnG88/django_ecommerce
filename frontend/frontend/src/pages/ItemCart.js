import React, { useState, useEffect, useContext } from "react";
import SavedItem from "../components/SavedItem";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import AuthContext from "../context/AuthContext";

const ItemCart = () => {
    const { accessToken } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    //const [csrftoken, setCsrftoken] = useState("");
    const [itemDetailList, setItemDetailList] = useState("");
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getCartItems();
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
            })
            .catch((error) => {
                console.log(error);
            });
    };
    */

    const getCartItems = async () => {
        //console.log("csrf", csrftoken);
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            //credentials: "include",
        };

        const response = await fetch(
            "http://localhost:8000/order-item/",
            requestOptions
        );
        const data = await response.json();
        console.log("Data", data);
        const itemDetail = data.map((item) => item.item_detail);
        const itemTotal = data.map((item) => item.get_total_item_price);
        const stringToNum = itemTotal.map((str) => {
            return Number(str);
        });
        console.log("Convert", stringToNum);

        // Add , 0 to reduce to not get TypeError: Reduce of empty array with no initial value.
        const totalPrice = stringToNum.reduce((total, item) => total + item, 0);

        //const totalPrice2 = itemTotal.map((a) =>
        //    JSON.parse(a).reduce((acc, curr) => acc + curr)
        //);
        //console.log("Item total reducer 2", totalPrice2);
        const itemResults = data.item_detail;
        console.log("Items", itemDetail);
        console.log("Items total", itemTotal);
        console.log("Items total reducer", totalPrice);
        setItems(data);
        setItemDetailList(itemDetail);
        setTotal(totalPrice.toFixed(2));
    };

    console.log("Item items", itemDetailList);

    const handleDelete = async (e, id, itemId) => {
        e.preventDefault();
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
        };
        const response = await fetch(
            `http://localhost:8000/order-item/${id}`,
            requestOptions
        );
        removeItem(id);
        updateStockOnDelete(itemId, id);
        // const data = await response.json();
        //console.log("delete data", data);
    };

    const removeItem = async (id) => {
        const newList = items.filter((item) => item.id !== id);
        setItems(newList);
    };

    const updateStockOnDelete = async (id, orderId) => {
        const singleItem = itemDetailList.find((x) => x.id === id);
        const orderItemId = items.find((item) => item.id === orderId);
        // setItemDetailList(singleItem);
        console.log("Single item", singleItem);
        console.log("Quantity", orderItemId);
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                stock: singleItem.stock + orderItemId.quantity,
            }),
        };
        const response = await fetch(
            `http://localhost:8000/items/${id}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("Update json", data);
        getCartItems();
        // setItemDetailList(data);
    };
    //console.log("Item detail", items.item_detail);
    //june 7, 23, jul 6, 21?, aug 4, 19, 30, sep 16
    return (
        <>
            {items.length > 0 ? (
                <>
                    {/*
                    <Container>
                        {items.map((item) => (
                            <Card key={item.id}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <div>
                                                <Card.Img
                                                    src={item.item_detail.image}
                                                    style={{ width: "200px" }}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <Card>
                                                <form>
                                                    <button
                                                        onClick={(e) =>
                                                            handleDelete(
                                                                e,
                                                                item.id,
                                                                item.item_detail
                                                                    .id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                    <p>Order id: {item.id}</p>
                                                    <p>
                                                        item number:{" "}
                                                        {item.item_detail.id}
                                                    </p>
                                                </form>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card>
                        ))}
                    </Container>
                    <h3>Total: {total}</h3>

                    <Link to="/ordered-items/">
                        <Button variant="info">View Order</Button>
                    </Link>*/}

                    <section className="d-flex align-items-baseline justify-content-around mt-5">
                        <section>
                            <Table
                                striped="columns"
                                className="shop-cart-table"
                            >
                                <thead>
                                    <tr>
                                        <th>
                                            <h1>Shopping Cart</h1>
                                        </th>
                                    </tr>
                                </thead>
                                {items.map((item) => (
                                    <tbody key={item.id}>
                                        <tr>
                                            <td>
                                                <Row>
                                                    <Col>
                                                        <Card.Img
                                                            className="mt-2 mb-2"
                                                            src={
                                                                item.item_detail
                                                                    .image
                                                            }
                                                            style={{
                                                                width: "200px",
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <p>
                                                            {
                                                                item.item_detail
                                                                    .name
                                                            }
                                                        </p>
                                                        <p>
                                                            {
                                                                item.item_detail
                                                                    .description
                                                            }
                                                        </p>
                                                        <Form>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    type="number"
                                                                    id="number2"
                                                                    min={1}
                                                                    max={
                                                                        item.quantity
                                                                    }
                                                                    value={
                                                                        item.quantity
                                                                    }
                                                                />
                                                                <InputGroup.Text>
                                                                    Qty.
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                        </Form>
                                                    </Col>
                                                    <Col>
                                                        $
                                                        {item.item_detail.price}
                                                    </Col>
                                                </Row>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </Table>

                            <div className="subtotal-div">
                                <h5>Subtotal: ${total}</h5>
                            </div>
                        </section>
                        <div className="col-span-offset">
                            <Container>
                                <Card className="subtotal-side-card d-flex justify-content-center align-items-center">
                                    <Row className="mb-4">
                                        <h5>Subtotal: ${total}</h5>
                                    </Row>
                                    <Row>
                                        <Link to="/ordered-items/">
                                            <Button
                                                className="p-checkout-btn"
                                                variant="warning"
                                            >
                                                Proceed to checkout
                                            </Button>
                                        </Link>
                                    </Row>
                                </Card>
                            </Container>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    <h2>No items in Cart</h2>

                    <Link to="/home/">
                        <Button variant="info">Add some items</Button>
                    </Link>
                </>
            )}
        </>
    );
};

export default ItemCart;
