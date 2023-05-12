import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const ItemList = ({ item }) => {
    return (
        <Card className="card-list-div">
            <Card.Img
                variant="top"
                src={item.image}
                style={{
                    objectFit: "cover",
                }}
            />
            <Card.Body>
                <Card.Text className="item-info">{item.description}</Card.Text>
                <Card.Text className="item-info">{item.price}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>In stock: {item.stock}</ListGroup.Item>
                <ListGroup.Item>How many sold: {item.sold}</ListGroup.Item>
            </ListGroup>
            <Card.Footer>
                {" "}
                <Link to={`/detail/${item.id}`}>
                    <Button className="flush-button">Detail View</Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default ItemList;
