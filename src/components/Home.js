import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const Home = ({ data }) => {
  console.log(data)
  const [bidAmounts, setBidAmounts] = useState(
    new Array(data.length).fill(null)
  );

  const currentDate = new Date();

  const updateBid = () => {
    
  }

  const handleBid = (itemPrice, index,itemIndex) => {
    const currentBid = parseFloat(bidAmounts[index]);
    if (currentBid > itemPrice) {
      
      const newData = [...data];
      newData[index].price = currentBid; 
      setBidAmounts([...bidAmounts]); 
      alert(`Bid successful! New price: ₹${currentBid}`);
      const url = `http://localhost:5000/api/auctions/${itemIndex}`;
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: currentBid })
      };
      console.log(url)
      fetch(url, options)
      .then(response => response.json())
      .then(responseData => {
        console.log("Server response:", responseData);
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Server error! Please try again later.");
      });
    } else {
      alert(`Bid amount must be greater than: ${itemPrice}`);
    }
    
    const newBidAmounts = [...bidAmounts];
    newBidAmounts[index] = "";
    setBidAmounts(newBidAmounts);
  };

  return (
    <>
      <div className="grid-container" style={{ margin: "40px auto" }}>
        {data.map((item, index) => (
         <div
         key={item._id} 
         className="card"
         style={{ width: "18rem", marginBottom: "20px" }}
          >
          
            <span
              className={`badge ${
                currentDate <= new Date(item.createdAt)
                  ? "text-bg-danger"
                  : "text-bg-success"
              }`}
              style={{ position: "absolute", top: "0", right: "0" }}
            >
              {currentDate >= new Date(item.createdAt) ? "Inactive" : "Active"}
            </span>
            <img
              src={`data:image/png;base64,${item.imageData}`}
              className="card-img-top"
              alt={item.name}
            />
            <div
              className="card-body bg-dark"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <h5 className="card-title text-light">{item.name}</h5>
              <p className="card-text text-light">{item.description} </p>
              
              <div style={{ marginTop: "auto", marginBottom: "10px" }}>
                <p className="card-text text-light mb-0">
                  Price: ₹{item.price}
                </p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your bid"
                  value={bidAmounts[index] || ""}                  onChange={(e) => {
                    const newBidAmounts = [...bidAmounts];
                    newBidAmounts[index] = e.target.value;
                    setBidAmounts(newBidAmounts);
                  }}
                />
              </div>
              <p>{ item.createdAt}</p>
              <button
                type="button"
                style={{ width: "100%" }}
                className="btn btn-primary"
                disabled={currentDate >= new Date(item.createdAt)}
                onClick={() => handleBid(item.price, index,item._id)}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;