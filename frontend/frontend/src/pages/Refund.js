import React, { useEffect, useContext, useState } from "react";
import {
    useParams,
    useNavigate,
    useSearchParams,
    useLocation,
} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Spinner from "react-bootstrap/Spinner";
import { formatDate } from "../utils/FormatDate";
import { config } from "../Constants";

const url = config.url.API_URL;

const Refund = () => {
    const year = new Date();

    const { accessToken } = useContext(AuthContext);
    const [orders, setOrders] = useState(null);
    const [option, setOption] = useState(year.getFullYear());
    const [arrayLength, setArrayLength] = useState("");
    const [spinner, setSpinner] = useState(false);
    //const [chosenYear, setChosenYear] = useState("");
    //const { urlParams } = useParams();
    const location = useLocation();

    const navigate = useNavigate();
    //const [queryParameters] = useSearchParams();

    //const chosenYear = queryParameters.get("year");
    //setChosenYear(paraYear);
    //console.log("chosen_year", chosenYear);

    //console.log("option", option);

    useEffect(() => {
        getOrders();
        //const currentParams = Object.fromEntries([...queryParameters]);

        //setOption(year.getFullYear());
    }, [location.search]);

    useEffect(() => {
        const params = new URLSearchParams();

        if (option) {
            params.append("year", option);
        } else {
            params.delete("year");
        }
        navigate({ search: params.toString() });
    }, [option, navigate]);

    /*
    useEffect(() => {
        const params = new URLSearchParams();

        if (option) {
            params.append("year", option);
        } else {
            params.delete("year");
        }

        getOrders();

        navigate({ search: params.toString() });
    }, [option, navigate]);
    */

    const getOrders = async () => {
        setSpinner(true);
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            //params: { year: chosenYear },
        };

        const response = await fetch(
            `${url}/refund-order/?year=${option}`,
            options
        );
        const data = await response.json();
        setOrders(data);
        setArrayLength(data.length);
        setSpinner(false);
    };

    const handleSelect = (e) => {
        //console.log("options", e);
        setOption(e);
    };

    return (
        <Container className="mt-4">
            <h1>Orders</h1>
            {spinner ? (
                <>
                    <Spinner className="mt-3"></Spinner>
                </>
            ) : (
                <>
                    {orders === null ? (
                        <></>
                    ) : orders.length >= 1 ? (
                        <Container className="mt-3">
                            <div className="dropdown-div mb-2 d-flex gap-1 align-items-center">
                                <p className="order-p mt-3 ml-2">
                                    {arrayLength} orders placed in{" "}
                                </p>
                                <DropdownButton
                                    variant="dark"
                                    title={option}
                                    onSelect={handleSelect}
                                >
                                    <Dropdown.Item eventKey="2023">
                                        2023
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2022">
                                        2022
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                            {orders.map((order) => (
                                <Card
                                    key={order.id}
                                    className="main-refund-card"
                                >
                                    <Card.Header className="main-card-refund-header">
                                        <Row
                                            xs="auto"
                                            className="header-order-info"
                                            style={{
                                                marginTop: ".25rem",
                                            }}
                                        >
                                            <Col>
                                                <p
                                                    className="header-order-info-p"
                                                    style={{
                                                        marginBottom: "-.25rem",
                                                    }}
                                                >
                                                    Order placed
                                                </p>
                                                <p className="header-order-info-p">
                                                    {formatDate(
                                                        order.ordered_date
                                                    )}
                                                </p>
                                            </Col>
                                            <Col>
                                                <p
                                                    className="header-order-info-p"
                                                    style={{
                                                        marginBottom: "-.25rem",
                                                    }}
                                                >
                                                    Total
                                                </p>
                                                <p className="header-order-info-p">
                                                    ${order.get_total}
                                                </p>
                                            </Col>
                                            <Col>
                                                <p
                                                    className="header-order-info-p"
                                                    style={{
                                                        marginBottom: "-.25rem",
                                                    }}
                                                >
                                                    Ship to
                                                </p>
                                                <p className="header-order-info-p">
                                                    {
                                                        order.customer_detail
                                                            .username
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Row key={order.id}>
                                        <Col>
                                            {order.order_items.map(
                                                (order_i) => (
                                                    <Card key={order_i.id}>
                                                        <Row>
                                                            <Col>
                                                                <Card.Img
                                                                    src={
                                                                        order_i
                                                                            .item_detail
                                                                            .image
                                                                    }
                                                                    style={{
                                                                        width: "100px",
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <h4>
                                                                    <p>
                                                                        {
                                                                            order_i
                                                                                .item_detail
                                                                                .description
                                                                        }
                                                                    </p>
                                                                </h4>
                                                            </Col>
                                                            <Col className="refund-button d-flex justify-content-center align-items-center">
                                                                {order_i.refunded ? (
                                                                    <div>
                                                                        <h4>
                                                                            <Badge bg="success">
                                                                                Refunded
                                                                            </Badge>
                                                                        </h4>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <Link
                                                                            to={`/refund-item/${order_i.id}`}
                                                                        >
                                                                            <Button variant="warning">
                                                                                Refund
                                                                                Item
                                                                            </Button>
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                )
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </Container>
                    ) : (
                        <div>No orders</div>
                    )}
                </>
            )}
        </Container>
    );
};

export default Refund;
