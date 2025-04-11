import React from 'react'
// import {logo} from "../assets/image.js";
import { Link } from 'react-router-dom';
import '../ipc/home.css';
import Header from '../ipc/header.jsx';

const home = () => {
  return (
    <div>
        <div className="template">
            <div className="box">
                <Header/>
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
  )
}

export default home;