import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Mail from './Mail'; 
import './App.css';

const App = () => {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'register':
        navigate('/register');
        break;
      case 'login':
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const handleRegister = () => {
    navigate('/login');
  };

  const handleLogin = (token) => {
    navigate(`/resetPassword/${token}`);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home onNavigate={handleNavigate} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/resetPassword/:token" element={<Mail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
