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

import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                    <Routes>
                        {/*<Route path="/" element={<App />}>*/}
                        <Route path="login" element={<LoginA />} />
                        <Route path="register" element={<Register />} />
                        <Route path="home" element={<HomePage />} />

                        <Route path="/" element={<PrivateRoute />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="profile" element={<Profile />} />
                            <Route
                                path="/detail/:detailId/"
                                element={<Detail />}
                            />

                            <Route path="/order-item/" element={<ItemCart />} />
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
            </BrowserRouter>
        </div>
    );
}

export default App;
