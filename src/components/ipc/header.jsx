import React from 'react';
import { Link } from 'react-router-dom';
import '../ipc/home.css';

const Header = ({ title = "Criminal Compendium" }) => {
  return (
    <header className="header">
      <Link to="/" className="header-link">
        <div className="header-right">
          <h2>{title}</h2>
        </div>
      </Link>
    </header>
  );
};

export default Header;