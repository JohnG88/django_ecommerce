import React, { useContext, useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useNavigate,
    useLocation,
    useMatch,
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//import Collapse from "react-bootstrap/Collapse";
import AuthContext from "../context/AuthContext";
//import { UserContext } from "./UserLoggedInContext";

export default function AppNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const homeMatch = useMatch("/");
    const allOrdersMatch = useMatch("/refund");
    const orderItemMatch = useMatch("/order-item");
    const profileMatch = useMatch("/profile");
    const loginMatch = useMatch("/login");
    const registerMatch = useMatch("/register");

    let { user, logoutUser } = useContext(AuthContext);
    //const [isOpen, setIsOpen] = useState(false);

    //const toggleNavbar = () => {
    //    setIsOpen(!isOpen);
    //};

    /*
    const [links, setLinks] = useState([
        { name: "Home", pathname: "/home", isDisabled: false },
        { name: "All Orders", pathname: "/refund", isDisabled: false },
        { name: "Item Cart", pathname: "/order-item", isDisabled: false },
    ]);

    useEffect(() => {
        const updatedLinks = links.map((link) => {
            return { ...link, isDisabled: location.pathname === link.pathname };
        });
        setLinks(updatedLinks);
    }, [location.pathname]);

    console.log("links", links);
    */

    //const [isDisabled, setIsDisabled] = useState(false);

    /*
    useEffect(() => {
        setIsDisabled(location.pathname === "/home");
        console.log("useEffect chosen", location.pathname);
    }, [location.pathname]);
    console.log("isDisabled", isDisabled);
    const searchUrlLocation = () => {
        console.log("location", location);
    };
    */

    // useEffect(() => {
    //   logout();
    // }, [userData]);
    /*  
    const logout = () => {
        fetch("http://localhost:8000/logout", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setUserData("");
                navigate("/home");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    */
    /*
    const handleCollapse = () => {
        console.log("handleCollapse");
        const nav = document.getElementById("navbarScroll");
        const btn = document.getElementById("navbarBtn");
        nav.classList.remove("show");
        btn.classList.add("collapsed");
    };
    */
    /* 
    const navLinks = document.querySelectorAll(".nav-link");
    const menuToggle = document.getElementById("navbarScroll");
    const bsCollapse = Collapse(menuToggle, { toggle: false });

    navLinks.forEach((l) => {
        l.addEventListener("click", () => {
            bsCollapse.toggle();
        });
    });
    */
    /*
    const navLinks = document.querySelectorAll(".check-nav-link");
    const checkUrlLocationTwo = () => {
        console.log("pathnames", location.pathname);

        for (let i = 0; i < navLinks.length; i++) {
            const urlHrefs = navLinks[i].getAttribute("href");
            console.log("hrefs", urlHrefs);
            console.log(
                "window location",
                window.location,
                window.location.pathname
            );
            navLinks[i].setAttribute("disabled", true);
            if (urlHrefs === location.pathname) {
                navLinks[i].classList.add("disabled");
            } else {
                navLinks[i].classList.remove("disabled");
            }
        }
    };
    */

    const myStyle = {};

    return (
        <>
            {/*
            <div className="topnav">
                {user ? (
                    <>
                        {
                            
                        <a href="#">
                            <li onClick={logoutUser}>Logout</li>
                        </a>
                         <li>
                                <Link
                                    className="remove-link-decorations"
                                    to="/home"
                                >
                                    Home
                                </Link>
                            </li>
                        }
                        <li>
                            <Link
                                className="remove-link-decorations"
                                to="/login"
                                onClick={logoutUser}
                            >
                                Logout
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="remove-link-decorations"
                                to="profile"
                            >
                                {user.username}
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="remove-link-decorations"
                                to="refund"
                            >
                                All Orders
                            </Link>
                        </li>

                        <li>
                            <Link
                                className="remove-link-decorations"
                                to="/order-item/"
                            >
                                Item Cart
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link
                                className="remove-link-decorations"
                                to="/login"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="remove-link-decorations"
                                to="/register"
                            >
                                Register
                            </Link>
                        </li>
                    </>
                )}
            </div>
            <Navbar bg="dark" variant="dark">
                <Nav className="me-auto">
                    <Nav.Link href="#home">Store</Nav.Link>
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
            </Navbar>
            */}

            <Navbar collapseOnSelect expand="lg" bg="light">
                <Container fluid>
                    <Nav.Link className="remove-link-decorations navbar-brand">
                        Store
                    </Nav.Link>
                    <Navbar.Toggle
                        aria-controls="navbarScroll"
                        id="navbarBtn"
                    />
                    <Navbar.Collapse id="navbarScroll">
                        {user ? (
                            <Nav
                                id="main-navbar"
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: "100px" }}
                                navbarScroll
                            >
                                <>
                                    <Nav.Link href="#">
                                        <Link
                                            to="/"
                                            className={
                                                "active remove-link-decorations nav-link check-nav-link" +
                                                (homeMatch ? " disabled" : "")
                                            }
                                        >
                                            Home
                                        </Link>
                                    </Nav.Link>

                                    <Nav.Link href="#">
                                        <Link
                                            to="/profile"
                                            className={
                                                "active remove-link-decorations nav-link check-nav-link" +
                                                (profileMatch
                                                    ? " disabled"
                                                    : "")
                                            }
                                        >
                                            {user.username}
                                        </Link>
                                    </Nav.Link>
                                    <Nav.Link href="#">
                                        <Link
                                            className={
                                                "active remove-link-decorations nav-link check-nav-link" +
                                                (allOrdersMatch
                                                    ? " disabled"
                                                    : "")
                                            }
                                            to="/refund"
                                        >
                                            All Orders
                                        </Link>
                                    </Nav.Link>
                                    <Nav.Link href="#">
                                        <Link
                                            className={
                                                "active remove-link-decorations nav-link check-nav-link" +
                                                (orderItemMatch
                                                    ? " disabled"
                                                    : "")
                                            }
                                            to="/order-item"
                                        >
                                            Item Cart
                                        </Link>
                                    </Nav.Link>

                                    <Nav.Link href="#">
                                        <NavLink
                                            className="active remove-link-decorations nav-link check-nav-link"
                                            to="/login"
                                            onClick={logoutUser}
                                        >
                                            Logout
                                        </NavLink>
                                    </Nav.Link>

                                    {/*
                                    {links.map((link, index) => (
                                        <Nav.Link href="#">
                                            <NavLink
                                                key={index}
                                                to={link.pathname}
                                                className="remove-link-decorations nav-link"
                                                activeClassName="active"
                                            >
                                                {link.name}
                                            </NavLink>
                                        </Nav.Link>
                                    ))}
                                    <Nav.Link href="#">
                                        <NavLink
                                            className="remove-link-decorations nav-link check-nav-link"
                                            to="/login"
                                            onClick={logoutUser}
                                        >
                                            Logout
                                        </NavLink>
                                    </Nav.Link>
                                    <Nav.Link href="#">
                                        <NavLink
                                            className="remove-link-decorations nav-link check-nav-link"
                                            to="/profile"
                                        >
                                            {user.username}
                                        </NavLink>
                                    </Nav.Link>
                                    */}
                                </>
                            </Nav>
                        ) : (
                            <Nav
                                id="main-navbar"
                                className="ms-auto my-2 my-lg-0"
                                style={{ maxHeight: "100px" }}
                                navbarScroll
                            >
                                <Nav.Link href="#">
                                    <Link
                                        className={
                                            "active remove-link-decorations nav-link check-nav-link" +
                                            (loginMatch ? " disabled" : "")
                                        }
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </Nav.Link>
                                <Nav.Link href="#">
                                    <Link
                                        className={
                                            "active remove-link-decorations nav-link check-nav-link" +
                                            (registerMatch ? " disabled" : "")
                                        }
                                        to="/register"
                                    >
                                        Register
                                    </Link>
                                </Nav.Link>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
