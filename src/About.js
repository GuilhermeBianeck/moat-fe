import React from "react";
import { MOAT_VERSION } from "./constants/Constants";
import "./css/About.css";
import "./css/PopUpContainer.css";

/**
 * A class representing the About popup page.
 */
class About extends React.Component {
  render() {
    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showAboutPage(false);
        }}
      >
        <div className="About PopUp-Screen RoundBorder">
          <h2>About</h2>
          <p>
            <span className="AboutAppTitle">
              MATT'S ONLINE AIM TRAINER v{MOAT_VERSION}
            </span>
          </p>
          <p>
            <span className="AboutCopyright">
              Copyright &copy; 2023 Matt Dixon
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default About;
