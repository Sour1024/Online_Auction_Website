
import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>About Our Online Auction System</h2>
      <p style={styles.paragraph}>
        Our online auction system provides a platform for users to buy and sell various items through auctions.
        Users can create auctions for their items, set starting prices, bid increments, and auction durations.
        Bidders can browse through available auctions, place bids, and compete with others to win the items.
        The system ensures transparency, fairness, and security throughout the auction process.
          </p>
          
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '80px auto', 
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center', 
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
  },
};

export default About;
