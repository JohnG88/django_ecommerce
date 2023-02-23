import React from "react";
// import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const ItemList = ({ item }) => {
    return (
        <Card>
            <Card.Img
                variant="top"
                src={item.image}
                style={{
                    objectFit: "cover",
                    height: "300px",
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
        </Card>
    );
};

export default ItemList;
