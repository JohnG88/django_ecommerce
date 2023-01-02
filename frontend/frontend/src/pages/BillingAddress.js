import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BillingAddress = () => {
    const [csrftoken, setCsrftoken] = useState("");
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
        getCSRFToken();
        getBilling();
    }, []);

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

    const getBilling = async () => {
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
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
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
    };

    const updateDefault = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "include",
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
    );
};

export default BillingAddress;
