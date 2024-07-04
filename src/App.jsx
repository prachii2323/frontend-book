import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import UserDashboard from './UserDash';
import AdminDashboard from './AdminDash';
import ViewBooks from './ViewBooks';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/view-books" component={<ViewBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
