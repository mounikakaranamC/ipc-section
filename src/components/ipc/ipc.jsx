import React, { useState, useEffect } from 'react';
import Header from '../ipc/header.jsx';
import '../ipc/home.css';
import { useNavigate } from 'react-router-dom';

const IPC = () => {
  const [numberSearch, setNumberSearch] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [ipcList, setIpcList] = useState([]); // all IPCs
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  // Fetch all IPC keys when page loads
  useEffect(() => {
    const fetchIPCKeys = async () => {
      try {
        const response = await fetch('http://103.168.19.67:5000/keys/IPC');
        if (!response.ok) {
          throw new Error('Failed to fetch IPC keys');
        }
        const result = await response.json();
        console.log("IPC Keys:", result);
        if (Array.isArray(result.keys)) {
          setIpcList(result.keys);
        } else {
          console.error('Invalid IPC keys format');
        }
      } catch (err) {
        console.error('Error fetching IPC keys:', err);
      }
    };

    fetchIPCKeys();
  }, []);

  // Fetch details for a selected IPC number
  const fetchIPCDetails = async (ipcCode) => {
    try {
      const response = await fetch(`http://103.168.19.67:5000/value/IPC/${encodeURIComponent(ipcCode)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch IPC details');
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
      setError('Failed to fetch IPC details');
    }
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumberSearch(value);
    setTextSearch('');
    setError(null);
    setSelectedItem(null);

    if (value.trim()) {
      // filter IPC list
      const filtered = ipcList.filter(ipc => ipc.includes(value));
      console.log("Filtered IPC Codes:", filtered); 
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

  const fetchDataByText = async (query) => {
    try {
      const response = await fetch(`http://103.168.19.67:5000/search/IPC/${encodeURIComponent(query)}`);
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

  return (
    <div className="template">
      <div className="box">
        <Header title="IPC" />
        <div className={`container ${selectedItem ? 'no-background' : ''}`}>

          {/* Number Search Input */}
          <div className="input-container" style={{ position: 'relative' }}>
          {/* 🔢 Number Search - with form support */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (numberSearch.trim()) {
                fetchIPCDetails(numberSearch.trim());
                setData([]);
              }
            }}
            className="input-container1"
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
                {data.map((ipcCode, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      fetchIPCDetails(ipcCode);
                      setData([]);
                      setNumberSearch(ipcCode);
                    }}
                  >
                    <p><strong>IPC:</strong> {ipcCode}</p>
                  </div>
                ))}
              </div>
            )}
          </form>
          </div>

          {/* Text Search Input */}
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
                      <strong>BNS:</strong> {item.BNS || '??'} &nbsp;&nbsp;
                      <strong>IPC:</strong> {item.IPC || '??'}<br />
                      <strong>Subject:</strong> {item.Subject || '??'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Item Display */}
          {selectedItem && (
            <div className="data-container">
              <div className="selected-item">
                <div className="data-box">
                  <p><strong>Title:</strong> {selectedItem.Title}</p>
                  <p><strong>BNS:</strong> {selectedItem.BNS}</p>
                  <p><strong>IPC:</strong> {selectedItem.IPC}</p>
                  <p><strong>Subject:</strong> {selectedItem.Subject}</p>
                  <p><strong>Summary:</strong> {selectedItem.Summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && <div className="error-box">{error}</div>}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default IPC;
