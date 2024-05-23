import React from 'react';
import './Home.css';

const Home = ({ onNavigate }) => {
  return (
    <div className="home">
      <h1>USER AUTHENTICATION</h1>
      <p>Welcome to Our Application</p>
      <div className="buttons">
        <button onClick={() => onNavigate('register')}>Register</button>
        <button onClick={() => onNavigate('login')}>Login</button>
      </div>
    </div>
  );
};

export default Home;
