import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './Public_Components/Homepage.jsx';
import Login from './Public_Components/Login.jsx';
import Register from './Public_Components/Register.jsx';
import Dashboard from "./private/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;