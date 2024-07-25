import React from "react";
import { VERSION } from "./constants/Constants";
import "./css/About.css";
import "./css/PopUpContainer.css";

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
              AIM TRAINER v{VERSION}
            </span>
          </p>
          <p>
          </p>
        </div>
      </div>
    );
  }
}

export default About;
