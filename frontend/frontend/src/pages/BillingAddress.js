import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import AuthContext from "../context/AuthContext";

const BillingAddress = () => {
    const { accessToken } = useContext(AuthContext);
    //const [csrftoken, setCsrftoken] = useState("");
    const [address, setAddress] = useState("");
    const [apt, setApt] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [billingAddress, setBillingAddress] = useState([]);
    const [defaultBilling, setDefaultBilling] = useState(false);
    const [checkboxCheck, setCheckboxCheck] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        //getCSRFToken();
        getBilling();
    }, []);

    /*  
    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                setCsrftoken(csrfToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    */

    const getBilling = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch(
            "http://localhost:8000/shipping/",
            requestOptions
        );
        const data = await response.json();
        const b_address = data.filter((item) => item.address_type == "B");
        setBillingAddress(b_address);
        console.log("Billing data", data);
    };

    console.log("Real billing address", billingAddress);

    const handleBillingChk = (e) => {
        if (e.target.checked) {
            console.log("Checkbox is checked");
            console.log("value", e.target.value);
        } else {
            console.log("Checkbox is Not checked");
        }
        setDefaultBilling((current) => !current);
        setValue(e.target.value);
    };

    const checkDefaultCheckbox = (e) => {
        if (e.target.checked) {
            console.log("Checkbox is checked");
            setCheckboxCheck(true);
        } else {
            console.log("Checkbox is not checked");
            setCheckboxCheck(false);
        }
    };
    console.log("Checkbox", checkboxCheck);

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
                billing: true,
                user_default_billing: defaultBilling,
                billing_checkbox: checkboxCheck,
                address: address,
                apt: apt,
                city: city,
                state: state,
                zipcode: zipcode,
            }),
        };
        const response = await fetch(
            "http://localhost:8000/shipping/",
            requestOptions
        );
        const data = await response.json();
        console.log("billing post", data);
        setAddress("");
        setApt("");
        setCity("");
        setState("");
        setZipcode("");
        setCheckboxCheck(false);
        getBilling();
    };

    const updateDefault = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({ user_default_billing: true, default: true }),
        };
        const response = await fetch(
            `http://localhost:8000/shipping/${value}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("Updated value", data);
        getBilling();
    };

    return (
        <>
            {/*
            <div>
                <div>
                    <form onSubmit={(e) => updateDefault(e)}>
                        {billingAddress.map((info) => (
                            <div key={info.id}>
                                <div className="ship-info-div">
                                    <label>
                                        <input
                                            type="radio"
                                            name="b-address"
                                            value={info.id}
                                            defaultChecked={info.default}
                                            onClick={handleBillingChk}
                                        />{" "}
                                        Default Billing
                                    </label>
                                    <button>Set default billing</button>
                                    <p>Billing address.</p>
                                    <p>
                                        {info.address}, {info.apt}, {info.city},{" "}
                                        {info.state}, {info.zipcode}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>

                <div>
                    <form id="billing" onSubmit={handleSubmit}>
                        <div>
                            <div>
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Apt.</label>
                                <input
                                    type="text"
                                    value={apt}
                                    onChange={(e) => setApt(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>State</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Zipcode</label>
                                <input
                                    type="text"
                                    value={zipcode}
                                    onChange={(e) => setZipcode(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="set_default_billing"
                                    id="set_default_billing"
                                    onChange={checkDefaultCheckbox}
                                    value={defaultBilling}
                                />
                                Set this address as default.
                            </label>
                        </div>
                        <button>Save Billing Address</button>
                    </form>
                </div>
                <Link to={"/ordered-items/"}>Go back to order</Link>
            </div>
            */}

            <div>
                <Container>
                    <Row>
                        <Col>
                            <div>
                                <div>
                                    <form onSubmit={(e) => updateDefault(e)}>
                                        {billingAddress.map((info) => (
                                            <Card key={info.id}>
                                                <Row>
                                                    <Col>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name="demo"
                                                                value={info.id}
                                                                defaultChecked={
                                                                    info.default
                                                                }
                                                                onClick={
                                                                    handleBillingChk
                                                                }
                                                            />{" "}
                                                            Default Billing
                                                        </label>
                                                    </Col>
                                                    <Col>
                                                        <p>
                                                            {info.address},{" "}
                                                            {info.apt},{" "}
                                                            {info.city},{" "}
                                                            {info.state},{" "}
                                                            {info.zipcode}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                        <Button type="submit">
                                            Set default address
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <Link to={"/ordered-items/"}>Go back to order</Link>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        Add New Address
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Form onSubmit={handleSubmit}>
                                            <Card>
                                                <Form.Group className="mb-2 form-group-label">
                                                    <Form.Label>
                                                        Address
                                                    </Form.Label>
                                                    <Form.Control
                                                        placeholder="Address"
                                                        value={address}
                                                        onChange={(e) =>
                                                            setAddress(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2 form-group-label">
                                                    <Form.Label>Apt</Form.Label>
                                                    <Form.Control
                                                        placeholder="Apt"
                                                        value={apt}
                                                        onChange={(e) =>
                                                            setApt(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2 form-group-label">
                                                    <Form.Label>
                                                        City
                                                    </Form.Label>
                                                    <Form.Control
                                                        placeholder="City"
                                                        value={city}
                                                        onChange={(e) =>
                                                            setCity(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2 form-group-label">
                                                    <Form.Label>
                                                        State
                                                    </Form.Label>
                                                    <Form.Control
                                                        placeholder="State"
                                                        value={state}
                                                        onChange={(e) =>
                                                            setState(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>

                                                <Form.Group className="form-group-label">
                                                    <Form.Label>
                                                        Zipcode
                                                    </Form.Label>
                                                    <Form.Control
                                                        placeholder="Zipcode"
                                                        value={zipcode}
                                                        onChange={(e) =>
                                                            setZipcode(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                            </Card>
                                            <Form.Group>
                                                <Row xs="auto">
                                                    <Col>
                                                        <Form.Check
                                                            name="set_default_shipping"
                                                            id="set_default_shipping"
                                                            onChange={(e) =>
                                                                setCheckboxCheck(
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                            checked={
                                                                checkboxCheck
                                                            }
                                                        />
                                                    </Col>{" "}
                                                    <Col>
                                                        <Form.Label>
                                                            Set this Address as
                                                            default.
                                                        </Form.Label>
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                            <Button type="submit">
                                                Save Shipping Address
                                            </Button>
                                        </Form>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default BillingAddress;
