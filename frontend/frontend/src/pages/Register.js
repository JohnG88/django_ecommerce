import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const { registerUser } = useContext(AuthContext);

    return (
        <div>
            <form onSubmit={registerUser}>
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
        </div>
    );
};

export default Register;
