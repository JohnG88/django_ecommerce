import { Outlet, Link } from 'react-router-dom';
import './App.css';
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="App">
	<Link to="/HomePage">Item Lists</Link>
	<Outlet />
    </div>
  );
}

export default App;
