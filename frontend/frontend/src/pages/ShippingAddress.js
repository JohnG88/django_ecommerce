import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShippingAddress = () => {
    //const userRef = useRef();
    const navigate = useNavigate();
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
        getCSRFToken();
        getShipping();
    }, []);

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

    const getShipping = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
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
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
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
        navigate("/ordered-items");
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
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
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
        <div>
            <div>
                <div>
                    <form onSubmit={(e) => updateDefault(e)}>
                        {shippingAddress.map((info) => (
                            <div key={info.id}>
                                <div className="ship-info-div">
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="demo"
                                                value={info.id}
                                                defaultChecked={info.default}
                                                onClick={handleShippingChk}
                                            />{" "}
                                            Default shipping
                                        </label>
                                    </div>
                                    <button>Set default address</button>
                                    <p>Shipping address.</p>
                                    <p>
                                        {info.address}, {info.apt}, {info.city},{" "}
                                        {info.state}, {info.zipcode}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>
                <form id="shipping" onSubmit={handleSubmit}>
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
                    <button>Save Shipping Address</button>
                </form>
                <label>
                    <input
                        type="checkbox"
                        name="set_default_shipping"
                        id="set_default_shipping"
                        onChange={checkDefaultCheckbox}
                        value={defaultShipping}
                    />
                    Set this address as default.
                </label>
            </div>
            <Link to={"/ordered-items/"}>Go back to order</Link>
        </div>
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
