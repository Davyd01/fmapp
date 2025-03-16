import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Medewekers</Link></li>
          <li><Link to="/errors">Fouten</Link></li>
          <li><Link to="/total">Totaal</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
