import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Footer() {
    return (
        <div className="footer-div">
            <footer className="footer">
                <Row className="footer-header">
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col className="store-col">
                                <h3>Store</h3>
                            </Col>
                            <Col className="eng-col">
                                <p>English</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
                <Container>
                    <Row>
                        <Col className="left-col">Left Column</Col>
                        <Col sm={8} className="mid-col">
                            <Row>
                                <Col>
                                    <div>About Us</div>
                                    <div>About us</div>
                                    <div>
                                        <a>Link</a>
                                    </div>
                                    <div>
                                        <a>Link</a>
                                    </div>
                                </Col>
                                <Col>
                                    <div>Contact Us</div>
                                    <div>Contact Us</div>
                                    <div>
                                        <a>Link</a>
                                    </div>
                                    <div>
                                        <a>Link</a>
                                    </div>
                                </Col>
                                <Col>
                                    <div>Social Media</div>
                                    <div>Social Media</div>
                                    <div>
                                        <a>Link</a>
                                    </div>
                                    <div>
                                        <a>Link</a>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="right-col">Right Column</Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}

export default Footer;
