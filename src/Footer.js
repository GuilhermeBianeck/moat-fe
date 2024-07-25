import React from "react";
import "./css/Footer.css";
import MainMenu from "./MainMenu.js";

/**
 * A class representing the Application page Footer.
 */
class Footer extends React.Component {
  render() {
    return (
      <div className="Footer">
          <MainMenu
            showLeaderBoard={this.props.showLeaderBoard}
            showAboutPage={this.props.showAboutPage}
            showOptionsPage={this.props.showOptionsPage}
            showStatsPage={this.props.showStatsPage}
          />
      </div>
    );
  }
}

export default Footer;

