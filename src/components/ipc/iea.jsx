import React, { useState, useEffect } from 'react';
import Header from '../ipc/header.jsx';
import '../ipc/home.css';
import { useNavigate } from 'react-router-dom';

const IEA = () => {
  const [numberSearch, setNumberSearch] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ieaList, setIeaList] = useState([]); 
  const navigate = useNavigate();

 // Fetch all IPC keys when page loads
  useEffect(() => {
     const fetchIEAKeys = async () => {
       try {
         const response = await fetch('http://103.168.19.67:5000/keys/IEA');
         if (!response.ok) {
           throw new Error('Failed to fetch IEA keys');
         }
         const result = await response.json();
         if (Array.isArray(result.keys)) {
           setIeaList(result.keys);
         } else {
           console.error('Invalid IEA keys format');
         }
       } catch (err) {
         console.error('Error fetching IEA keys:', err);
       }
     };
 
     fetchIEAKeys();
   }, []);

  const fetchIEADetails = async (ieaCode) => {
    try {
      const response = await fetch(`http://103.168.19.67:5000/value/IEA/${encodeURIComponent(ieaCode)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch IEA details');
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
      setError('Failed to fetch IEA details');
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
      const filtered = ieaList.filter(iea => iea.includes(value));
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
      const response = await fetch(`http://103.168.19.67:5000/search/IEA/${encodeURIComponent(query)}`);
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
        <Header title="IEA" />
        <div className={`container ${selectedItem ? 'no-background' : ''}`}>

          {/* 🔢 Number Search */}
          <div className="input-container" style={{ position: 'relative' }}>
            {/* 🔢 Number Search - with form support */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (numberSearch.trim()) {
                fetchIEADetails(numberSearch.trim());
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
                {data.map((ieaCode, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      fetchIEADetails(ieaCode);
                      setData([]);
                      setNumberSearch(ieaCode);
                    }}
                  >
                    <p>
                      <strong>IEA:</strong> {ieaCode}
                    </p>
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
            {/* 🔤 Text Search Results */}
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
                    <strong>BSA:</strong> {item.BSA || '??'} &nbsp;&nbsp;
                    <strong>IEA:</strong> {item.IEA || '??'}&nbsp;&nbsp;
                    <br />
                    <strong>Subject:</strong> {item.Subject || '??'}
                  </p>
                </div>
              ))}
            </div>
          )}
          </div>          

          {/* ✅ Selected Result */}
          {selectedItem && (
            <div className="data-container">
              <div className="selected-item">
                <div className="data-box">
                  <p><strong>Title:</strong> {selectedItem.Title}</p>
                  <p><strong>BSA:</strong> {selectedItem.BSA}</p>
                  <p><strong>IEA:</strong> {selectedItem.IEA}</p>
                  <p><strong>Subject:</strong> {selectedItem.Subject}</p>
                  <p><strong>Summary:</strong> {selectedItem.Summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* ❌ Error Display */}
          {error && <div className="error-box">{error}</div>}
        </div>
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

export default IEA;
