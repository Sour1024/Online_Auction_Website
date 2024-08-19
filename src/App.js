
import React, { useEffect, useState } from 'react';
import Form from './components/Form.js';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './components/Home.js';
import Axios from 'axios';
import Login from './components/Login.js';
import About from './components/About.js'
import Register from './components/Register.js';

const App = () => {
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      
      const token = localStorage.getItem('token');
      if (token) {
     
        setIsLoggedIn(true);
      }
      setLoading(false); 
    }
    checkAuthentication();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await Axios.get('http://localhost:5000/api/auctions');
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchItems();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ background: '#ffffff' }}>
       <BrowserRouter>
        {isLoggedIn ? (
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<Home data={data} />} />
              <Route path="/about" element={<About />} />
              <Route path="/addauctions" element={<Form />} />
             
            </Routes>
          </div>
        ) : (
          <Routes>
              <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register />} />
          </Routes>
        )} 
      </BrowserRouter>  
      
    </div>
  );
};

export default App;
