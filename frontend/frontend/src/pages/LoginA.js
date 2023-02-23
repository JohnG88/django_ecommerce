import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import AuthContext from "../context/AuthContext";

const LoginA = () => {
    const { loginUser } = useContext(AuthContext);

    // Can get username and password using e.target.username.value, e.target.password.value
    return (
        <div className="d-flex justify-content-center align-items-center register-login-div">
            {/*
            <form onSubmit={loginUser}>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                />
                <input type="submit" />
            </form>
            */}
            <Card className="register-login-form-card">
                <Container>
                    <Form onSubmit={loginUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                placeholder="Enter Username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                            />
                        </Form.Group>{" "}
                        <Button
                            className="mb-2"
                            variant="primary"
                            type="submit"
                        >
                            Login
                        </Button>
                    </Form>
                </Container>
            </Card>
        </div>
    );
};

export default LoginA;
