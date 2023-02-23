import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import AuthContext from "../context/AuthContext";

const ShippingAddress = () => {
    //const userRef = useRef();
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    const [csrftoken, setCsrftoken] = useState("");
    const [address, setAddress] = useState("");
    const [apt, setApt] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [shippingAddress, setShippingAddress] = useState([]);
    const [defaultShipping, setDefaultShipping] = useState(false);
    const [checkboxCheck, setCheckboxCheck] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        //userRef.current.focus();
        //getCSRFToken();
        getShipping();
    }, []);

    /*
    const getCSRFToken = () => {
        fetch("http://localhost:8000/csrf", {
            credentials: "include",
            // withCredentials: true,
        })
            .then((res) => {
                let csrfToken = res.headers.get("X-CSRFToken");
                setCsrftoken(csrfToken);
                console.log("csrf ", csrfToken);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    */

    const getShipping = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            //credentials: "include",
        };
        const response = await fetch(
            "http://localhost:8000/shipping/",
            requestOptions
        );
        const data = await response.json();
        const s_address = data.filter((item) => item.address_type == "S");
        setShippingAddress(s_address);
        console.log("Shipping data", data);
    };

    const handleShippingChk = (e) => {
        if (e.target.checked) {
            console.log("Checkbox is checked");
            console.log("radio value", e.target.value);
        } else {
            console.log("Checkbox is Not checked");
        }
        setDefaultShipping((current) => !current);
        setValue(e.target.value);
    };
    console.log("default shipping", defaultShipping);
    /*  
    const checkDefaultCheckbox = (e) => {
        if (e.target.checked) {
            console.log("Checkbox is checked");
            setDefaultShipping(true);
        } else {
            console.log("Checkbox is not checked");
            setDefaultShipping(false);
        }
    };
    */
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
                shipping: true,
                user_default_shipping: defaultShipping,
                checkbox: checkboxCheck,
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
        console.log("Shippping", data);
        //navigate("/ordered-items");
        setAddress("");
        setApt("");
        setCity("");
        setState("");
        setZipcode("");
        setCheckboxCheck(false);
        getShipping();
    };

    const updateDefault = async (e) => {
        e.preventDefault();
        //const addressUpdateId = shippingAddress.find(
        //    (address) => address.id === id
        //);
        // DRF allows PATCH
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                //"X-CSRFToken": csrftoken,
            },
            //credentials: "include",
            body: JSON.stringify({
                user_default_shipping: true,
                default: true,
            }),
        };
        const response = await fetch(
            `http://localhost:8000/shipping/${value}/`,
            requestOptions
        );
        const data = await response.json();
        console.log("Updated value", data);
        getShipping();
    };

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <div>
                            <div>
                                <form onSubmit={(e) => updateDefault(e)}>
                                    {shippingAddress.map((info) => (
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
                                                                handleShippingChk
                                                            }
                                                        />{" "}
                                                        Default shipping
                                                    </label>
                                                </Col>
                                                <Col>
                                                    <p>
                                                        {info.address},{" "}
                                                        {info.apt}, {info.city},{" "}
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
                                                <Form.Label>Address</Form.Label>
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
                                                        setApt(e.target.value)
                                                    }
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-2 form-group-label">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    placeholder="City"
                                                    value={city}
                                                    onChange={(e) =>
                                                        setCity(e.target.value)
                                                    }
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-2 form-group-label">
                                                <Form.Label>State</Form.Label>
                                                <Form.Control
                                                    placeholder="State"
                                                    value={state}
                                                    onChange={(e) =>
                                                        setState(e.target.value)
                                                    }
                                                />
                                            </Form.Group>

                                            <Form.Group className="form-group-label">
                                                <Form.Label>Zipcode</Form.Label>
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
                                                                e.target.checked
                                                            )
                                                        }
                                                        checked={checkboxCheck}
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
        </>
    );

    //const radioButtons = [
    //    { value: "option1", label: "Option 1", checked: false },
    //    { value: "option2", label: "Option 2", checked: true },
    //    { value: "option3", label: "Option 3", checked: false }
    //];

    //const radioButtonElements = radioButtons.map(button => {
    //     return `<input type="radio" value="${button.value}" ${
    //    button.checked ? "checked" : ""
    //    }> ${button.label}<br>`;
    //});

    //console.log(radioButtonElements);
};

export default ShippingAddress;
