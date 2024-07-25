import React from "react";

import "./css/Header.css";
import { Link } from "react-router-dom";

/**
 * A class representing the Application Header that displays the Menu and Title.
 */
class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <header>
          <h1>
            <Link to="/">Aim Trainer</Link>
          </h1>
        </header>
      </div>
    );
  }
}

export default Header;
