
import React, { useState, useEffect } from 'react';
import './Header.css'; 
import { Link,useNavigate } from 'react-router-dom'




const Header = () => {

  let navigate = useNavigate()
  const [auctions, setAuctions] = useState([]);

  const handleLogout = () => { 
    localStorage.removeItem('token');
    

    window.location.reload();
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/auctions')
      .then(response => response.json())
      .then(data => setAuctions(data))
      .catch(error => console.error('Error fetching auctions:', error));
  }, []);

  return (
    
    <header style={{marginBottom: '20px',background:'#424547'}}>
      <h1 className='text-light'>My Auction App</h1>
      <nav>
        <ul className="nav-links "> 
          <li><a className='text-light' href="/">Home</a></li>
          
          <li ><Link className='text-light' to ="/about">About </Link></li>
          <li><Link className='text-light' to="/addauctions">Add</Link></li>
          <button className='btn btn-primary '  onClick={handleLogout}>Logout</button>
        </ul>
       
      </nav>
    </header>
  );
};

export default Header;
