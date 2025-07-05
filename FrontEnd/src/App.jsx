import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Public/Pages/Homepage";
import Login from "./Public/Pages/Login";
import Register from "./Public/Pages/Register";
import Dashboard from "./private/Pages/Dashboard";
import Profile from "./private/Pages/Profile";
import AdminDashboard from "./private/Pages/AdminDashboard";
import About from "./Public/Pages/Aboutus";
import Contact from "./Public/Pages/Contact";
import AddRental from "./private/Pages/AddRentals";
import ForgotPassword from "./Public/Pages/ForgotPassword";
import ResetPassword from "./Public/Pages/ResetPassword";

//This is made by Siddhartha Bhattarai.

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile/>}/>
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path ="/about" element ={<About/>}/>
         <Route path ="/contact" element ={<Contact/>}/>
      <Route path="/add-rental" element={<AddRental />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
              <Route path="/reset-password/:token" element={<ResetPassword />} />



      </Routes>
    </Router>
  );
}

export default App;