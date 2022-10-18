import React, { useState, createContext } from "react";
// check ou this link https://www.youtube.com/watch?v=35lXWvCuM8o&t=1522s

// import UserContext to get user data
export const UserContext = createContext();

// UserProvider is gonna provide info to the different components
// This might be old, but same concept
// Import to where have all router urls in {}, import {UserProvider} from "./components/file.js"

// In component you want to use data, that is wrapped in .Provider, import the UserContext and useContext
// The add a const value = useContext(UserContext), in component you want to use data in (can also use const [userData, setUserData] = useContext(UserContext))

// so to update context from other components,  import {useContext} from 'react';
// Also import {UserContext} from './UserLoggedInContext';
// Then write, const [userData, setUserData] = useContext(UserContext);
// Then add setUserData() into a function, you also have access to latest rendered userData, so you can write, setUserData(prevUserData => [...prevUserDate, ]), can add change data, have to see other example, can also add data to previous data
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState("");
    return (
        <UserContext.Provider value={[userData, setUserData]}>
            {/*This is where other components go (Navbar />, <Home />)*/}
            {children}
        </UserContext.Provider>
    );
};
