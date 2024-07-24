import React from "react";
import "./css/Footer.css";

/**
 * A class representing the Application page Footer.
 */
class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Footer">
        <p>Copyright &copy; 2023 Matt Dixon</p>
        <p>
          <a
            href="#"
            onClick={() => {
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
