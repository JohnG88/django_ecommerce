import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

const Profile = () => {
    //const { user, accessToken } = useContext(AuthContext);
    const {
        userProfile,
        profileData,
        changeAvatar,
        profileAvatar,
        deleteAvatar,
    } = useContext(AuthContext);

    const ref = useRef();

    //console.log("profile page avatar", profileAvatar);

    //const [userData, setUserData] = useState([]);
    //console.log("profile page function", userProfile);
    //console.log("profile page data", profileData);

    useEffect(() => {
        userProfile();
    }, [profileAvatar]);

    const handleRef = () => {
        ref.current.value = "";
    };

    /*
    const userProfile = async () => {
        //e.preventDefault();
        const userId = user.user_id;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await fetch(
            `http://localhost:8000/users/${userId}/`,
            options
        );
        const data = await response.json();
        console.log("profile response", data);
        setUserData(data);
    };
    */

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <img
                        className="profile-image"
                        src={profileData.avatar}
                        width="150px"
                        height="150px"
                    />
                    <div className="mt-1">
                        <label htmlFor="avatar-file" className="pointer-label">
                            Customize Avatar
                        </label>
                    </div>

                    <div>
                        <label
                            className="pointer-label"
                            onClick={(e) => {
                                deleteAvatar();
                                handleRef();
                            }}
                        >
                            Set Avatar to default
                        </label>
                    </div>
                    <div>
                        <input
                            id="avatar-file"
                            style={{ visibility: "hidden" }}
                            type="file"
                            ref={ref}
                            onChange={changeAvatar}
                        />
                    </div>
                </Col>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{profileData.username}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <Row>
                        <Link
                            className="remove-link-decorations"
                            to="/shipping"
                            state={{ from: "/profile" }}
                        >
                            Shipping Address
                        </Link>
                    </Row>
                    <Row>
                        <Link className="remove-link-decorations" to="/billing">
                            Billing Address
                        </Link>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
