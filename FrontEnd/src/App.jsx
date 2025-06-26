import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Public/Pages/Homepage";
import Login from "./Public/Pages/Login";
import Register from "./Public/Pages/Register";
import Dashboard from "./private/Pages/Dashboard";
import Profile from "./private/Pages/Profile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile/>}/>

      </Routes>
    </Router>
  );
}

export default App;