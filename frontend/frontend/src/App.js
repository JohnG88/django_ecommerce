import { Outlet, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
function App() {
    return (
        <div className="App">
            <Link to="/home">Item Lists</Link>
            <Outlet />
        </div>
    );
}

export default App;
