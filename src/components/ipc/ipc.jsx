import React, { useState, useEffect } from 'react';
import Header from '../ipc/header.jsx';
import '../ipc/home.css';

const IPC = () => {
  const [numberSearch, setNumberSearch] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // const fetchData = async (query, type) => {
  //   if (!query.trim()) return;
  
  //   try {
  //     const url = `http://103.168.19.67:5000/value/IPC/${encodeURIComponent(query)}`;

  //     const result = {
  //       'url': url
  //     };
      
  //     console.log(`Calling: http://103.168.19.67:5000/value/IPC/${encodeURIComponent(query)}`);
  //     console.log(`Constructed URL for ${type}:`, result);
  
  //     setData(result);
  //     setError(null);
  //   } catch (err) {
  //     console.error('Error:', err.message || err);
  //     setError(`No data found for ${type}`);
  //     setData(null);
  //   }
  // };
  

  // Function to fetch data
  const fetchData = async (query, type) => {
    if (!query.trim()) return;
  
    try {
      const url = `http://103.168.19.67:5000/value/IPC/${encodeURIComponent(query)}`;
      console.log('Fetching from URL:', url);
  
      const response = await fetch(url);
      console.log('Status:', response.status);
  
      if (!response.ok) {
        const text = await response.text(); // Log body for error insight
        console.error('Error response:', text);
        throw new Error('Failed to fetch data');
      }
  
      const result = await response.json();
      console.log('Fetched data:', result);
  
      if (Object.keys(result).length === 0) {
        throw new Error('No data found');
      }
  
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`No data found for ${type}`);
      setData(null);
    }
  };

  // // const fetchData = async (query, type) => {
  //   if (!query.trim()) return;
  
  //   try {
  //     // Clean query manually
  //     const cleanedQuery = query.replace(/ /g, '+'); // Replace spaces with +
  //     const url = `http://103.168.19.67:5000/value/IPC/${cleanedQuery}`;
  //     console.log('Fetching from:', url);
  
  //     const response = await fetch(url);
  //     console.log('Status:', response.status);
  
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error('Error response:', errorText);
  //       throw new Error('Failed to fetch data');
  //     }
  
  //     const result = await response.json();
  //     console.log('Fetched data:', result);
  
  //     if (Object.keys(result).length === 0) {
  //       throw new Error('No data found');
  //     }
  
  //     setData(result);
  //     setError(null);
  //   } catch (err) {
  //     console.error('Fetch error:', err);
  //     setError(`No data found for ${type}`);
  //     setData(null);
  //   }
  // };
  

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
        <Header title ="IPC" />
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

export default IPC;