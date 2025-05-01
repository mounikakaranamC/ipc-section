import React, { useState, useEffect } from 'react';
import Header from '../ipc/header.jsx';
import '../ipc/home.css';
import { useNavigate } from 'react-router-dom';

const CRPC = () => {
  const [numberSearch, setNumberSearch] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [crpcList, setCrpcList] = useState([]);
  const navigate = useNavigate();

  //  Fetch the full CRPC keys list once
  useEffect(() => {
    const fetchCRPCKeys = async () => {
      try {
        const response = await fetch('http://103.168.19.67:5000/keys/CRPC');
        if (!response.ok) {
          throw new Error('Failed to fetch CRPC keys');
        }
        const result = await response.json();
        if (Array.isArray(result)) {
          setCrpcList(result);
        } else {
          console.error('Invalid keys format for CRPC');
        }
      } catch (err) {
        console.error('Error fetching CRPC keys:', err);
      }
    };

    fetchCRPCKeys();
  }, []);

  // Fetch details for a selected CRPC number
  const fetchCRPCDetails = async (crpcCode) => {
    try {
      const response = await fetch(`http://103.168.19.67:5000/value/CRPC/${encodeURIComponent(crpcCode)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch CRPC details');
      }
      const result = await response.json();
      if (result) {
        setSelectedItem(result);
        setError(null);
      } else {
        setSelectedItem(null);
        setError('No details found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setSelectedItem(null);
      setError('Failed to fetch CRPC details');
    }
  };

  const fetchDataByText = async (query) => {
    try {
      const response = await fetch(`http://103.168.19.67:5000/search/CRPC/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch text search');
      }
      const result = await response.json();
      if (result?.result?.length > 0) {
        setData(result.result);
        setError(null);
      } else {
        setData([]);
        setError('No matching results');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setData([]);
      setError('Failed to fetch text search results');
    }
  };
  // Handle back button
  useEffect(() => {
    const handleBack = (event) => {
      event.preventDefault();
      navigate('/');
    };

    window.addEventListener('popstate', handleBack);

    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, [navigate]);

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumberSearch(value);
    setTextSearch('');
    setError(null);
    setSelectedItem(null);

    if (value.trim()) {
      // filter CRPC list
      const filtered = crpcList.filter(crpc => crpc.includes(value));
      setData(filtered);
    } else {
      setData([]);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextSearch(value);
    setNumberSearch('');
    setError(null);
    setSelectedItem(null);

    if (value.trim()) {
      fetchDataByText(value);
    }
  };

  return (
    <div className="template">
      <div className="box">
        <Header title="CRPC" />
        <div className={`container ${selectedItem ? 'no-background' : ''}`}>

          {/* 🔢 Number Search */}
          <div className="input-container" style={{ position: 'relative' }}>
          {/* 🔢 Number Search - with form support */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (numberSearch.trim()) {
                fetchCRPCDetails(numberSearch.trim());
                setData([]);
              }
            }}
            className="input-container"
            style={{ position: 'relative' }}
          >
            <input
              type="text"
              placeholder="Search by number..."
              value={numberSearch}
              onChange={handleNumberChange}
              className="input-field"
            />

            {numberSearch && !selectedItem && Array.isArray(data) && data.length > 0 && (
              <div className="dropdown-list">
                {data.map((crpcCode, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      fetchCRPCDetails(crpcCode);
                      setData([]);
                      setNumberSearch(crpcCode);
                    }}
                  >
                     <p><strong>CRPC:</strong> {crpcCode}</p>
                  </div>
                ))}
              </div>
            )}
          </form>
          </div>

          {/* 🔤 Text Search */}
          <div className="input-container" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by text..."
              value={textSearch}
              onChange={handleTextChange}
              className="input-field"
            />
            {textSearch && !selectedItem && Array.isArray(data) && data.length > 0 && (
              <div className="dropdown-list">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedItem(item);
                      setTextSearch(item.Subject || '');
                      setData([]);
                    }}
                  >
                    <p>
                      <strong>BNS:</strong> {item.BNS || item.BNSS || '??'} &nbsp;&nbsp;
                      <strong>CRPC:</strong> {item.CRPC || item.CrPC || '??'}<br />
                      <strong>Subject:</strong> {item.Subject || '??'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Selected item display */}
          {selectedItem && (
            <div className="data-container">
              <div className="selected-item">
                <div className="data-box">
                  <p><strong>Title:</strong> {selectedItem.Title}</p>
                  <p><strong>BNSS:</strong> {selectedItem.BNS || selectedItem.BNSS}</p>
                  <p><strong>CRPC:</strong> {selectedItem.CRPC || selectedItem.CrPC}</p>
                  <p><strong>Subject:</strong> {selectedItem.Subject}</p>
                  <p><strong>Summary:</strong> {selectedItem.Summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* ❌ Error box */}
          {error && <div className="error-box">{error}</div>}
        </div>

        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>
    </div>
  );
};

export default CRPC;
