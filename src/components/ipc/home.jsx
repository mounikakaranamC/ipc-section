import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../ipc/home.css';
import Header from '../ipc/header.jsx';
import { App as CapacitorApp } from '@capacitor/app';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async () => {
      // If user is at Home page ('/'), then ask to exit
      if (location.pathname === '/') {
        if (window.confirm('Do you want to exit the app?')) {
          await CapacitorApp.exitApp();
        }
      } else {
        // If inside other page (like /ipc), go back normally
        window.history.back();
      }
    };

    const addBackButtonListener = async () => {
      try {
        CapacitorApp.addListener('backButton', handleBackButton);
      } catch (error) {
        console.error('Failed to add back button listener:', error);
      }
    };

    addBackButtonListener();

    // Cleanup when component unmounts
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [location]); // Listen to route changes

  return (
    <div>
      <div className="template">
        <div className="box">
          <Header />
          <div className="sections-box">
            <div className="section">
              <Link to="/ipc" className="section-button">IPC</Link>
            </div>
            <div className="section">
              <Link to="/crpc" className="section-button">CRPC</Link>
            </div>
            <div className="section">
              <Link to="/iea" className="section-button">IEA</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;