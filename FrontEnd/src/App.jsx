import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './Public_Components/Homepage.jsx';
import Login from './Public_Components/Login.jsx';
import Register from './Public_Components/Register.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;