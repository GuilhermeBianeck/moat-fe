import React from "react";
import ShootingGallery from "./ShootingGallery.js";

import "./css/Body.css";

class Body extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Body">
        <ShootingGallery
          difficulty={this.props.difficulty}
          playMusic={this.props.playMusic}
          playSounds={this.props.playSounds}
          setLastGameStats={this.props.setLastGameStats}
          sendScoreToServer={this.props.sendScoreToServer}
        />
      </div>
    );
  }
}

export default Body;
