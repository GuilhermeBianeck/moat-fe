import React from "react";
import Loading from "./Loading.js";
import "./css/LeaderBoard.css";
import "./css/PopUpContainer.css";

/**
 * A class representing the LeaderBoard popup overlay.
 */
class LeaderBoard extends React.Component {
  constructor(props) {
    console.log("Constructing LeaderBoard.");
    super(props);
  }

  render() {
    let i = 0;

    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target != evt.currentTarget) return;

          this.props.showLeaderBoard(false);
        }}
      >
        <div className="LeaderBoard PopUp-Screen RoundBorder">
          <h2>Leaderboard</h2>

          {this.props.leaderBoardLoading ? <Loading /> : null}

          {!this.props.leaderBoardLoading && !this.props.leaderBoard.length ? (
            <p className="LeaderBoardEmptyMsg">Leaderboard is empty</p>
          ) : null}

          {this.props.leaderBoard.map((entry) => (
            <div key={i++} className="LeaderBoardEntry">
              <span className="LeaderBoardName">{entry.nickname}</span>
              <span className="LeaderBoardScore">{entry.score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default LeaderBoard;
