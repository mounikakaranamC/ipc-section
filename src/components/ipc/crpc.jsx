import React, { useState, useEffect } from 'react';
import Header from '../ipc/header.jsx';
import '../ipc/home.css';

const CRPC = () => {
  const [numberSearch, setNumberSearch] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchData = async (query, type) => {
    if (!query.trim()) return;

    try {
        const response = await fetch(`http://103.168.19.67:5000/value/CRPC/${encodeURIComponent(query)}`);

      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      console.log(`API Response for ${type}:, result`);

      if (Object.keys(result).length === 0) {
        throw new Error('No data found');
      }

      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(`No data found for ${type}`);
      setData(null);
    }
  };

  // Handle number search
  useEffect(() => {
    if (numberSearch) {
      fetchData(numberSearch, 'number');
    }
  }, [numberSearch]);

  // Handle text search
  useEffect(() => {
    if (textSearch) {
      fetchData(textSearch, 'text');
    }
  }, [textSearch]);

  // Handle input change ensuring the other field is cleared first
  const handleNumberChange = (e) => {
    setTextSearch(''); // Clear text search before updating number
    setData(null);
    setError(null);
    setNumberSearch(e.target.value);
  };

  const handleTextChange = (e) => {
    setNumberSearch(''); // Clear number search before updating text
    setData(null);
    setError(null);
    setTextSearch(e.target.value);
  };

  return (
    <div className="template">
      <div className="box">
        <Header title ="CRPC" />
        <div className="container">

          {/* 🔤 Search by Text */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Search by text..."
              value={textSearch}
              onChange={handleTextChange}
              className="input-field"
            />
          </div>

          {/* 🔢 Search by Number */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Search by number..."
              value={numberSearch}
              onChange={handleNumberChange}
              className="input-field"
            />
          </div>

          {/* ✅ Show Data Only When Available */}
          {data && (
            <div className="data-container">
              {Object.entries(data).map(([key, value], index) => (
                <div key={index} className="data-box">
                  <h3>{key}:</h3>
                  <p>{value || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {/* ❌ Show Error Only When Applicable */}
          {error && <div className="error-box">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CRPC;