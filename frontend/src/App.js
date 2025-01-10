import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Overview from "./pages/Overview";
import VillageManagement from "./pages/VillageManagement";
import Gallery from "./pages/Gallery";
import Chat from "./pages/Chat";

// ProtectedRoute component
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  return token ? <Component {...rest} /> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/overview" element={<ProtectedRoute element={Overview} />} />
        <Route path="/villages" element={<ProtectedRoute element={VillageManagement} />} />
        <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
        <Route path="/gallery" element={<ProtectedRoute element={Gallery} />} />
      </Routes>
    </Router>
  );
}

export default App;
