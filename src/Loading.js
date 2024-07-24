import React from "react";
import "./css/Loading.css";

class Loading extends React.Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loading-container">
        <img className="loading-image" src="/images/target.svg" />
      </div>
    );
  }
}

export default Loading;
