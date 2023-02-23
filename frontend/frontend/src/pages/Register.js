import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const { registerUser } = useContext(AuthContext);

    return (
        <div className="d-flex justify-content-center align-items-center register-login-div">
            {/*<form onSubmit={registerUser}>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                />
                <input type="email" name="email" placeholder="Enter Email" />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                />

                <input
                    type="password"
                    name="re_password"
                    placeholder="Re-enter Password"
                />

                <input type="submit" />
            </form>
            */}
            <Card className="register-login-form-card">
                <Container>
                    <Form onSubmit={registerUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                placeholder="Enter Username"
                            />
                        </Form.Group>{" "}
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                placeholder="Enter Email"
                            />
                        </Form.Group>{" "}
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                            />
                        </Form.Group>{" "}
                        <Form.Group className="mb-3">
                            <Form.Label>Re-enter Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="re_password"
                                placeholder="Re-enter Password"
                            />
                        </Form.Group>
                        <Button
                            className="mb-2"
                            variant="primary"
                            type="submit"
                        >
                            Register
                        </Button>
                    </Form>
                </Container>
            </Card>
        </div>
    );
};

export default Register;
