import React from "react";
import "./css/Loading.css";

class Loading extends React.Component {
  state = {};

  render() {
    return (
      <div className="loading-container">
        <img
          alt="Loading..."
          className="loading-image"
          src="/images/target.svg"
        />
      </div>
    );
  }
}

export default Loading;
