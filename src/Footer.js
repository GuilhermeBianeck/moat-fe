import React from "react";
import "./css/Footer.css";

/**
 * A class representing the Application page Footer.
 */
class Footer extends React.Component {
  render() {
    return (
      <div className="Footer">
        <p>Copyright &copy; 2023 Matt Dixon</p>
        <p>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              this.props.showAdminPage();
            }}
          >
            Admin Menu
          </a>
        </p>
      </div>
    );
  }
}

export default Footer;
