import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Detail from "./pages/Detail";
import AddOrder from "./pages/AddOrder";
import ItemCart from "./pages/ItemCart";
//import Login from "./pages/LoginPage";
import Register from "./pages/Register";
import LoginA from "./pages/LoginA";
import Profile from "./pages/Profile";
import DashBoard, { Dashboard } from "./pages/Dashboard";
import OrderItems from "./pages/OrderedItems";
import ShippingAddress from "./pages/ShippingAddress";
import BillingAddress from "./pages/BillingAddress";
import OrderPlaced from "./pages/OrderPlaced";
import Refund from "./pages/Refund";
import RefundItem from "./pages/RefundItem";
import RefundConfirm from "./pages/RefundConfirm";

import MainNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
//const SECRET_KEY = process.env.REACT_APP_STRIPE_API_KEY;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

//const stripePromise = loadStripe(
//    "pk_test_51MbBxyAiXv078N17V9ukZj6eRNktfczUy6a2nLBvmxOtfNn1TdMIn1lSnYU4yRPKxA2Dx0LPnd2cW4aKM8d9HxBQ00yihHwGzd"
//);

function App() {
    return (
        <Elements stripe={stripePromise}>
            <div className="App main-app-div">
                <BrowserRouter>
                    <AuthProvider>
                        <MainNavbar />
                        <Routes>
                            {/*<Route path="/" element={<App />}>*/}
                            <Route path="login" element={<LoginA />} />
                            <Route path="register" element={<Register />} />
                            <Route path="/" element={<HomePage />} />{" "}
                            <Route
                                path="/detail/:detailId/"
                                element={<Detail />}
                            />
                            <Route path="/" element={<PrivateRoute />}>
                                <Route
                                    path="dashboard"
                                    element={<Dashboard />}
                                />
                                <Route path="profile" element={<Profile />} />

                                <Route
                                    path="/order-item/"
                                    element={<ItemCart />}
                                />
                                <Route
                                    path="/ordered-items/"
                                    element={<OrderItems />}
                                />
                                <Route
                                    path="/shipping/"
                                    element={<ShippingAddress />}
                                />
                                <Route
                                    path="/billing/"
                                    element={<BillingAddress />}
                                />
                                <Route
                                    path="/order-item/:savedId"
                                    element={<AddOrder />}
                                />
                                <Route
                                    path="/order-placed/"
                                    element={<OrderPlaced />}
                                />
                                <Route path="/refund/" element={<Refund />} />
                                <Route
                                    path="/refund-item/:orderItemId/"
                                    element={<RefundItem />}
                                />
                                <Route
                                    path="/refund-confirm/:orderItemId/"
                                    element={<RefundConfirm />}
                                />
                            </Route>
                            <Route
                                path="*"
                                element={
                                    <div style={{ padding: "1rem" }}>
                                        <p>There is nothing here!</p>
                                    </div>
                                }
                            />
                            {/*</Route>*/}
                        </Routes>
                    </AuthProvider>
                    <Footer />
                </BrowserRouter>
            </div>
        </Elements>
    );
}

export default App;
