import React from "react";
import "./css/ErrorPage.css";

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="error-page-container RoundBorder">
        <h2>OOPS!</h2>
        <img className="error-page-img" src="/images/target.svg" />
        <p className="error-page-msg">Page not found!</p>
      </div>
    );
  }
}

export default ErrorPage;
