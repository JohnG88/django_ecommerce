import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import HomePage from "./pages/HomePage";
import Detail from "./pages/Detail";
import AddOrder from "./pages/AddOrder";
import ItemCart from "./pages/ItemCart";
import Login from "./pages/LoginPage";
import DashBoard, { Dashboard } from "./pages/Dashboard";
import OrderItems from "./pages/OrderedItems";
import ShippingAddress from "./pages/ShippingAddress";
import BillingAddress from "./pages/BillingAddress";

import { Navbar } from "./components/Navbar";
import { UserProvider } from "./components/UserLoggedInContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="login" element={<Login />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="home" element={<HomePage />} />
                        <Route path="/detail/:detailId" element={<Detail />} />
                        <Route path="/order-item/" element={<ItemCart />} />
                        <Route
                            path="/ordered-items/"
                            element={<OrderItems />}
                        />
                        <Route
                            path="/shipping/"
                            element={<ShippingAddress />}
                        />
                        <Route path="/billing/" element={<BillingAddress />} />
                        <Route
                            path="/order-item/:savedId"
                            element={<AddOrder />}
                        />
                        <Route
                            path="*"
                            element={
                                <div style={{ padding: "1rem" }}>
                                    <p>There is nothing here!</p>
                                </div>
                            }
                        />
                    </Route>
                </Routes>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>
);
